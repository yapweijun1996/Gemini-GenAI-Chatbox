import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMessages, saveMessage, getSetting, saveSetting } from './db.js';
import { appendMessage, scrollToBottom, addCopyButtons } from './ui.js';
import { memoryAgent, storageAgent, retrievalAgent } from './agents.js';

async function sendMessageWithFallback(text, image = null, apiKeys, currentKeyIndex, chatLog) {
    let tries = 0;
    const maxTries = apiKeys.length;

    while (tries < maxTries) {
        const keyToTry = apiKeys[currentKeyIndex];
        console.log(`Attempting to use API key #${currentKeyIndex + 1}`);

        try {
            const ai = new GoogleGenerativeAI(keyToTry);
            const modelName = await getSetting('modelName', 'gemini-2.5-flash');
            const history = await getMessages();
            let chatHistory = history.map(msg => {
                const parts = [];
                if (msg.text) {
                    parts.push({ text: msg.text });
                }
                if (msg.image) {
                     parts.push({ inlineData: { mimeType: msg.image.mimeType, data: msg.image.base64 } });
                }
                return { role: msg.role, parts };
            }).filter(msg => msg.parts.length > 0);
            
            // Ensure history starts with a user message
            const firstUserIndex = chatHistory.findIndex(msg => msg.role === 'user');
            if (firstUserIndex > -1) {
                chatHistory = chatHistory.slice(firstUserIndex);
            } else {
                chatHistory = []; // History is invalid if no user message is present
            }
            
            const parser = new UAParser();
            const uaResult = parser.getResult();
            const os = `${uaResult.os.name} ${uaResult.os.version}`;
            const browser = `${uaResult.browser.name} ${uaResult.browser.version}`;
            const now = new Date();
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const localTime = now.toLocaleString();
            
            const relevantMemories = await retrievalAgent(keyToTry, text);

            const systemInstruction = `You are a helpful and friendly conversational AI. Your name is Gemini.
            Current user context:
            - OS: ${os}
            - Browser: ${browser}
            - Current Time: ${localTime}
            - Timezone: ${timeZone}
            
            Here are some relevant memories from past conversations:
            ${relevantMemories.join('\n')}

            Always format your responses using Markdown. For code, use language-specific code blocks.`;

            const model = ai.getGenerativeModel({ model: modelName, systemInstruction });
            const chat = model.startChat({ history: chatHistory.slice(0, -1) });

            const promptParts = [];
            if (text) {
                promptParts.push(text);
            }
            if (image) {
                promptParts.push({ inlineData: { mimeType: image.mimeType, data: image.base64 } });
            }

            const streamResult = await chat.sendMessageStream(promptParts);
            
            console.log(`API key #${currentKeyIndex + 1} succeeded.`);
            
            let aiMessageWrapperId;
            let accumulatedText = '';
            for await (const chunk of streamResult.stream) {
                const chunkText = chunk.text();
                accumulatedText += chunkText;
                if (!aiMessageWrapperId) {
                    aiMessageWrapperId = appendMessage(chatLog, { role: 'model', text: '...' });
                }
                const messageElement = document.getElementById(aiMessageWrapperId);
                if (messageElement) {
                    const proseElement = messageElement.querySelector('.prose div');
                    if(proseElement) {
                        proseElement.innerHTML = marked.parse(accumulatedText + ' ▋');
                    }
                    scrollToBottom(chatLog);
                }
            }
            const finalElement = document.getElementById(aiMessageWrapperId);
            if (finalElement) {
               const proseElement = finalElement.querySelector('.prose div');
               if(proseElement) {
                    proseElement.innerHTML = marked.parse(accumulatedText);
               }
               addCopyButtons(finalElement);
            }
            await saveMessage({ role: 'model', text: accumulatedText });

            const newMemories = await memoryAgent(keyToTry, [
                ...history,
                { role: 'user', parts: [{text}] },
                { role: 'model', parts: [{text: accumulatedText}] }
            ]);
            await storageAgent(newMemories);

            return;

        } catch (e) {
            console.warn(`API key #${currentKeyIndex + 1} failed.`, e);
            tries++;
            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
            await saveSetting('currentKeyIndex', currentKeyIndex);
        }
    }

    throw new Error("All API keys failed. Please check your keys in the settings.");
}

export {
    sendMessageWithFallback
};