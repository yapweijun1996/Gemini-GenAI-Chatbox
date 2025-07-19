const DB_NAME = "GeminiChatDB";
const DB_VERSION = 2;
const SETTINGS_STORE = "settings";
const MESSAGES_STORE = "messages";
const MEMORY_STORE = "memory";
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
            if (!db.objectStoreNames.contains(MEMORY_STORE)) {
                db.createObjectStore(MEMORY_STORE, { keyPath: "id", autoIncrement: true });
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

async function saveMemory(memory) {
    await dbPut(MEMORY_STORE, { ...memory, timestamp: new Date() });
}

async function getAllMemory() {
    return await dbGetAll(MEMORY_STORE);
}

async function clearMemory() {
    await dbClear(MEMORY_STORE);
}

export {
    openDb,
    getSetting,
    saveSetting,
    getMessages,
    saveMessage,
    clearMessages,
    saveMemory,
    getAllMemory,
    clearMemory
};