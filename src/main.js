import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Constants ---
const ENCRYPTION_KEY = "your-super-secret-key"; // A simple key for obfuscation

// --- DOM Elements ---
const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');
const errorMessageContainer = document.getElementById('error-message');
const settingsButton = document.getElementById('settings-button');
const clearChatButton = document.getElementById('clear-chat-button');
const settingsModal = document.getElementById('settings-modal');
const apiKeyInput = document.getElementById('api-key-input');
const saveSettingsButton = document.getElementById('save-settings-button');
const cancelSettingsButton = document.getElementById('cancel-settings-button');
const modelSelect = document.getElementById('model-select');
const currentModelSpan = document.getElementById('current-model');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageButton = document.getElementById('remove-image-button');
const attachFileButton = document.getElementById('attach-file-button');
const fileInput = document.getElementById('file-input');

// --- State ---
let apiKeys = [];
let currentKeyIndex = 0;
let isLoading = false;
let attachedImage = null; // To store { base64, mimeType }

// --- SVGs ---
const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-slate-400"><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd"></path></svg>`;
const aiIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-slate-400"><path fill-rule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3.375a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75z" clip-rule="evenodd"></path></svg>`;
const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`;
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`;

// --- Sanitization ---
function sanitizeHTML(text) {
    return text.replace(/&/g, '&')
               .replace(/</g, '<')
               .replace(/>/g, '>')
               .replace(/"/g, '"')
               .replace(/'/g, '&#039;');
}

// --- Encryption ---
function encrypt(text) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return btoa(result);
}

function decrypt(encryptedText) {
    let result = "";
    const decodedText = atob(encryptedText);
    for (let i = 0; i < decodedText.length; i++) {
        result += String.fromCharCode(decodedText.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return result;
}

// --- IndexedDB ---
const DB_NAME = "GeminiChatDB";
const DB_VERSION = 1;
const SETTINGS_STORE = "settings";
const MESSAGES_STORE = "messages";
let db;

function openDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => reject("Error opening DB");
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
                db.createObjectStore(SETTINGS_STORE, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
                const store = db.createObjectStore(MESSAGES_STORE, { keyPath: "id", autoIncrement: true });
                store.createIndex("timestamp", "timestamp", { unique: false });
            }
        };
    });
}

function dbGet(storeName, key) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not open");
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function dbGetAll(storeName) {
     return new Promise((resolve, reject) => {
        if (!db) return reject("DB not open");
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function dbPut(storeName, value) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not open");
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function dbClear(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not open");
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function getSetting(key, defaultValue) {
    const result = await dbGet(SETTINGS_STORE, key);
    return result ? result.value : defaultValue;
}

async function saveSetting(key, value) {
    await dbPut(SETTINGS_STORE, { id: key, value });
}

async function getMessages() {
    return await dbGetAll(MESSAGES_STORE);
}

async function saveMessage(message) {
    await dbPut(MESSAGES_STORE, { ...message, timestamp: new Date() });
}

async function clearMessages() {
    await dbClear(MESSAGES_STORE);
}

// --- Helper Functions ---
function scrollToBottom() {
    chatLog.scrollTop = chatLog.scrollHeight;
}

function showError(message) {
    errorMessageContainer.innerHTML = `<p><strong>Oops! Something went wrong.</strong></p><p>${message}</p>`;
    errorMessageContainer.classList.remove('hidden');
}

function toggleLoading(state) {
    isLoading = state;
    sendButton.disabled = state;
    chatInput.disabled = state;
    if (state) {
        typingIndicator.classList.remove('hidden');
        scrollToBottom();
    } else {
        typingIndicator.classList.add('hidden');
        chatInput.focus();
    }
}

function addCopyButtons(container) {
    const codeBlocks = container.querySelectorAll('pre');
    codeBlocks.forEach(block => {
        if (block.parentElement.parentElement?.classList.contains('code-block-wrapper')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        const preWrapper = document.createElement('div');

        block.parentNode.insertBefore(wrapper, block);

        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = `${copyIcon} Copy`;
        button.addEventListener('click', () => {
            const code = block.querySelector('code')?.innerText || '';
            navigator.clipboard.writeText(code).then(() => {
                button.innerHTML = `${checkIcon} Copied!`;
                setTimeout(() => { button.innerHTML = `${copyIcon} Copy`; }, 2000);
            }).catch(err => { button.textContent = 'Failed!'; });
        });
        
        preWrapper.appendChild(block);
        wrapper.appendChild(button);
        wrapper.appendChild(preWrapper);
    });
}

function appendMessage(message) {
    const { role, text, image } = message;
    const messageId = `message-${Date.now()}-${Math.random()}`;
    const messageWrapper = document.createElement('div');
    messageWrapper.id = messageId;
    messageWrapper.classList.add('flex', 'items-end', 'gap-2');
    const isUser = role === 'user';

    const bubbleClasses = isUser ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none';
    messageWrapper.classList.add(isUser ? 'justify-end' : 'justify-start');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('px-4', 'py-3', 'rounded-2xl', 'text-white', 'prose', ...bubbleClasses.split(' '));
    contentDiv.style.maxWidth = '85vw';

    if (image) {
        const imgElement = document.createElement('img');
        imgElement.src = image.base64.startsWith('data:') ? image.base64 : `data:${image.mimeType};base64,${image.base64}`;
        imgElement.className = 'max-w-xs md:max-w-sm rounded-lg mb-2';
        contentDiv.appendChild(imgElement);
    }

    if (text) {
        const textContent = document.createElement('div');
        textContent.innerHTML = marked.parse(text);
        contentDiv.appendChild(textContent);
    }
    
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('flex-shrink-0');
    iconDiv.innerHTML = isUser ? userIcon : aiIcon;

    if (isUser) {
        messageWrapper.appendChild(contentDiv);
        messageWrapper.appendChild(iconDiv);
    } else {
        messageWrapper.appendChild(iconDiv);
        messageWrapper.appendChild(contentDiv);
    }
    chatLog.appendChild(messageWrapper);
    addCopyButtons(messageWrapper);
    scrollToBottom();
    return messageId;
}

// --- Core Logic ---
async function sendMessageWithFallback(text, image = null) {
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
            
            const systemInstruction = `You are a helpful and friendly conversational AI. Your name is Gemini.
            Current user context:
            - OS: ${os}
            - Browser: ${browser}
            - Current Time: ${localTime}
            - Timezone: ${timeZone}
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
                    aiMessageWrapperId = appendMessage({ role: 'model', text: '...' });
                }
                const messageElement = document.getElementById(aiMessageWrapperId);
                if (messageElement) {
                    const proseElement = messageElement.querySelector('.prose div');
                    if(proseElement) {
                        proseElement.innerHTML = marked.parse(accumulatedText + ' ▋');
                    }
                    scrollToBottom();
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

async function handleSendMessage(event) {
    event.preventDefault();
    if (isLoading || apiKeys.length === 0) return;
    
    const text = sanitizeHTML(chatInput.value);
    if (!text.trim() && !attachedImage) return;

    toggleLoading(true);
    errorMessageContainer.classList.add('hidden');

    const userMessage = { role: 'user', text: text.trim() };
    if (attachedImage) {
        userMessage.image = {
            base64: attachedImage.base64,
            mimeType: attachedImage.mimeType
        };
    }

    appendMessage(userMessage);
    await saveMessage(userMessage);

    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatInput.placeholder = "Type your message or add an image...";
    
    // Clear image preview
    if (attachedImage) {
        attachedImage = null;
        fileInput.value = '';
        imagePreviewContainer.classList.add('hidden');
        imagePreview.src = '';
    }

    try {
        await sendMessageWithFallback(userMessage.text, userMessage.image);
    } catch (e) {
        showError(e.message);
    } finally {
        toggleLoading(false);
    }
}

async function initializeChat() {
    toggleLoading(true);
    chatInput.placeholder = "Initializing...";
    
    await openDb();
    const encryptedKeys = await getSetting('apiKeys', []);
    currentKeyIndex = await getSetting('currentKeyIndex', 0);
    const modelName = await getSetting('modelName', 'gemini-2.5-flash');
    
    if (encryptedKeys.length === 0) {
        showError("No API Keys found. Please add your key(s) in the settings.");
        toggleLoading(true); 
        chatInput.placeholder = "Please set API Key(s) in Settings.";
        settingsModal.classList.remove('hidden');
        apiKeyInput.focus();
        return;
    }

    apiKeys = encryptedKeys.map(decrypt);

    try {
        // Load history to UI
        const history = await getMessages();
        chatLog.innerHTML = '';
        history.forEach(appendMessage);
        currentModelSpan.textContent = modelName;

        if (history.length === 0) {
             const introMessage = { role: 'model', text: `Hello! I am Gemini, your personal AI assistant. Loaded ${apiKeys.length} API key(s). Your chat history will be saved. How can I help you today?` };
             appendMessage(introMessage);
             await saveMessage(introMessage);
        }
        
        toggleLoading(false);
        chatInput.placeholder = "Type your message...";

    } catch (e) {
        const errorText = e instanceof Error ? e.message : 'An unknown error occurred during initialization.';
        showError(`Initialization failed: ${errorText}.`);
        toggleLoading(true);
        chatInput.placeholder = "Application is disabled.";
    }
}

// --- Event Listeners ---
chatForm.addEventListener('submit', handleSendMessage);

attachFileButton.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            attachedImage = {
                base64: reader.result.split(',')[1],
                mimeType: file.type,
            };
            imagePreview.src = reader.result;
            imagePreviewContainer.classList.remove('hidden');
            chatInput.placeholder = "Describe the image or ask a question...";
        };
        reader.readAsDataURL(file);
    }
    // reset file input to allow selecting the same file again
    event.target.value = '';
});

removeImageButton.addEventListener('click', () => {
    attachedImage = null;
    fileInput.value = ''; // Reset file input
    imagePreviewContainer.classList.add('hidden');
    imagePreview.src = '';
    chatInput.placeholder = "Type your message or add an image...";
});

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
});

chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    const newHeight = Math.min(chatInput.scrollHeight, 200); // Max height of 200px on input
    chatInput.style.height = (newHeight) + 'px';
});

settingsButton.addEventListener('click', async () => {
    const encryptedKeys = await getSetting('apiKeys', []);
    apiKeyInput.value = encryptedKeys.map(decrypt).join('\n');
    modelSelect.value = await getSetting('modelName', 'gemini-2.5-flash');
    settingsModal.classList.remove('hidden');
});

clearChatButton.addEventListener('click', async () => {
     if (confirm("Are you sure you want to clear the entire chat history? This cannot be undone.")) {
        await clearMessages();
        location.reload();
     }
});

cancelSettingsButton.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

saveSettingsButton.addEventListener('click', async () => {
    const rawKeys = apiKeyInput.value.split('\n').map(k => k.trim()).filter(k => k);
    if (rawKeys.length > 0) {
        const encryptedKeys = rawKeys.map(encrypt);
        await saveSetting('apiKeys', encryptedKeys);
        await saveSetting('modelName', modelSelect.value);
        await saveSetting('currentKeyIndex', 0); // Reset index on save
        settingsModal.classList.add('hidden');
        location.reload();
    } else {
        alert("API Key(s) cannot be empty.");
    }
});

// --- Initialization ---
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language, ignoreIllegals: true }).value;
  }
});

initializeChat();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}