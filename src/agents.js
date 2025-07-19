import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveMemory, getAllMemory } from './db.js';

function cleanJson(text) {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    if (match) {
        return match[1];
    }
    return text;
}

async function memoryAgent(apiKey, history) {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
        You are a memory agent. Your task is to analyze the following conversation and extract key information to be stored in a long-term memory.
        Extract facts, user preferences, and any other important details that should be remembered for future conversations.
        Return ONLY the information as a valid JSON object with a single key "memory" which contains an array of strings.
        If no new information is present, return an empty array.

        Conversation:
        ${JSON.stringify(history)}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const json = JSON.parse(cleanJson(text));
        return json.memory;
    } catch (e) {
        console.error("Memory Agent Error:", e);
        return [];
    }
}

async function storageAgent(memories) {
    for (const memory of memories) {
        await saveMemory({ text: memory });
    }
}

async function retrievalAgent(apiKey, query) {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const memories = await getAllMemory();

    if (memories.length === 0) {
        return [];
    }

    const prompt = `
        You are a retrieval agent. Your task is to select the most relevant memories from the following list to help answer the user's query.
        Return ONLY the most relevant memories as a valid JSON object with a single key "relevant_memories" which contains an array of strings.
        Do not return more than 5 memories.

        Memories:
        ${JSON.stringify(memories.map(m => m.text))}

        Query:
        ${query}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const json = JSON.parse(cleanJson(text));
        return json.relevant_memories;
    } catch (e) {
        console.error("Retrieval Agent Error:", e);
        return [];
    }
}

export {
    memoryAgent,
    storageAgent,
    retrievalAgent
};