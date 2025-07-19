import { openDb, getSetting, saveSetting, getMessages, saveMessage, clearMessages, clearMemory, getAllMemory } from './db.js';
import { scrollToBottom, showError, toggleLoading, addCopyButtons, appendMessage } from './ui.js';
import { sendMessageWithFallback } from './gemini.js';

    // --- Constants ---
    const ENCRYPTION_KEY = "your-super-secret-key"; // A simple key for obfuscation

    // --- DOM Elements (will be initialized in main) ---
    let chatLog, chatForm, chatInput, sendButton, typingIndicator, errorMessageContainer,
        settingsButton, clearChatButton, settingsModal, apiKeyInput, saveSettingsButton,
        cancelSettingsButton, modelSelect, currentModelSpan, imagePreviewContainer,
        imagePreview, removeImageButton, attachFileButton, fileInput, clearMemoryButton,
        viewMemoryButton, memoryModal, memoryContent, closeMemoryModalButton;

    // --- State ---
    let apiKeys = [];
    let currentKeyIndex = 0;
    let isLoading = false;
    let attachedImage = null; // To store { base64, mimeType }


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



    // --- Core Logic ---

    async function handleSendMessage(event) {
        event.preventDefault();
        if (isLoading || apiKeys.length === 0) return;
        
        const text = sanitizeHTML(chatInput.value);
        if (!text.trim() && !attachedImage) return;

        toggleLoading(true, sendButton, chatInput, typingIndicator, chatLog);
        errorMessageContainer.classList.add('hidden');

        const userMessage = { role: 'user', text: text.trim() };
        if (attachedImage) {
            userMessage.image = {
                base64: attachedImage.base64,
                mimeType: attachedImage.mimeType
            };
        }

        appendMessage(chatLog, userMessage);
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
            await sendMessageWithFallback(userMessage.text, userMessage.image, apiKeys, currentKeyIndex, chatLog);
        } catch (e) {
            showError(errorMessageContainer, e.message);
        } finally {
            toggleLoading(false, sendButton, chatInput, typingIndicator, chatLog);
        }
    }

    async function initializeChat() {
        toggleLoading(true, sendButton, chatInput, typingIndicator, chatLog);
        chatInput.placeholder = "Initializing...";
        
        const encryptedKeys = await getSetting('apiKeys', []);
        currentKeyIndex = await getSetting('currentKeyIndex', 0);
        const modelName = await getSetting('modelName', 'gemini-2.5-flash');
        
        if (encryptedKeys.length === 0) {
            showError(errorMessageContainer, "No API Keys found. Please add your key(s) in the settings.");
            toggleLoading(true, sendButton, chatInput, typingIndicator, chatLog);
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
            history.forEach(message => appendMessage(chatLog, message));
            currentModelSpan.textContent = modelName;

            if (history.length === 0) {
                 const introMessage = { role: 'model', text: `Hello! I am Gemini, your personal AI assistant. Loaded ${apiKeys.length} API key(s). Your chat history will be saved. How can I help you today?` };
                 appendMessage(chatLog, introMessage);
                 await saveMessage(introMessage);
            }
            
            toggleLoading(false, sendButton, chatInput, typingIndicator, chatLog);
            chatInput.placeholder = "Type your message...";

        } catch (e) {
            const errorText = e instanceof Error ? e.message : 'An unknown error occurred during initialization.';
            showError(errorMessageContainer, `Initialization failed: ${errorText}.`);
            toggleLoading(true, sendButton, chatInput, typingIndicator, chatLog);
            chatInput.placeholder = "Application is disabled.";
        }
    }

    // --- Main Application Setup ---
    async function main() {
        try {
            // 1. Initialize DOM Elements now that the DOM is ready
            chatLog = document.getElementById('chat-log');
            chatForm = document.getElementById('chat-form');
            chatInput = document.getElementById('chat-input');
            sendButton = document.getElementById('send-button');
            typingIndicator = document.getElementById('typing-indicator');
            errorMessageContainer = document.getElementById('error-message');
            settingsButton = document.getElementById('settings-button');
            clearChatButton = document.getElementById('clear-chat-button');
            settingsModal = document.getElementById('settings-modal');
            apiKeyInput = document.getElementById('api-key-input');
            saveSettingsButton = document.getElementById('save-settings-button');
            cancelSettingsButton = document.getElementById('cancel-settings-button');
            modelSelect = document.getElementById('model-select');
            currentModelSpan = document.getElementById('current-model');
            imagePreviewContainer = document.getElementById('image-preview-container');
            imagePreview = document.getElementById('image-preview');
            removeImageButton = document.getElementById('remove-image-button');
            attachFileButton = document.getElementById('attach-file-button');
            fileInput = document.getElementById('file-input');
            clearMemoryButton = document.getElementById('clear-memory-button');
            viewMemoryButton = document.getElementById('view-memory-button');
            memoryModal = document.getElementById('memory-modal');
            memoryContent = document.getElementById('memory-content');
            closeMemoryModalButton = document.getElementById('close-memory-modal-button');

            // 2. Initialize Database first
            await openDb();

            // 3. Setup Event Listeners now that DB is ready
            chatForm.addEventListener('submit', handleSendMessage);
            attachFileButton.addEventListener('click', () => fileInput.click());
            clearChatButton.addEventListener('click', async () => {
                 if (confirm("Are you sure you want to clear the entire chat history? This cannot be undone.")) {
                    await clearMessages();
                    location.reload();
                 }
            });
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        attachedImage = { base64: reader.result.split(',')[1], mimeType: file.type };
                        imagePreview.src = reader.result;
                        imagePreviewContainer.classList.remove('hidden');
                        chatInput.placeholder = "Describe the image or ask a question...";
                    };
                    reader.readAsDataURL(file);
                }
                event.target.value = '';
            });
            removeImageButton.addEventListener('click', () => {
                attachedImage = null;
                fileInput.value = '';
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
                const newHeight = Math.min(chatInput.scrollHeight, 200);
                chatInput.style.height = (newHeight) + 'px';
            });
            document.addEventListener('click', async (event) => {
                const target = event.target.closest('button');
                if (!target) return;

                switch (target.id) {
                    case 'settings-button': {
                        const encryptedKeys = await getSetting('apiKeys', []);
                        apiKeyInput.value = encryptedKeys.map(decrypt).join('\n');
                        modelSelect.value = await getSetting('modelName', 'gemini-2.5-flash');
                        settingsModal.classList.remove('hidden');
                        break;
                    }
                    case 'cancel-settings-button':
                        settingsModal.classList.add('hidden');
                        break;
                    case 'save-settings-button': {
                        const rawKeys = apiKeyInput.value.split('\n').map(k => k.trim()).filter(k => k);
                        if (rawKeys.length > 0) {
                            const encryptedKeys = rawKeys.map(encrypt);
                            await saveSetting('apiKeys', encryptedKeys);
                            await saveSetting('modelName', modelSelect.value);
                            await saveSetting('currentKeyIndex', 0);
                            settingsModal.classList.add('hidden');
                            location.reload();
                        } else {
                            alert("API Key(s) cannot be empty.");
                        }
                        break;
                    }
                    case 'view-memory-button': {
                        const memories = await getAllMemory();
                        memoryContent.innerHTML = memories.length === 0
                            ? '<p class="text-slate-400">No memories found.</p>'
                            : memories.map(mem => `<div class="p-2 border-b border-slate-700">${mem.text}</div>`).join('');
                        memoryModal.classList.remove('hidden');
                        break;
                    }
                    case 'clear-memory-button':
                        if (confirm("Are you sure you want to clear the AI's memory? This cannot be undone.")) {
                            await clearMemory();
                            alert("AI memory has been cleared.");
                        }
                        break;
                    case 'close-memory-modal-button':
                        memoryModal.classList.add('hidden');
                        break;
                }
            });

            // 4. Configure Libraries
            marked.setOptions({
              highlight: function(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language, ignoreIllegals: true }).value;
              }
            });
            
            // 5. Initialize Chat UI
            await initializeChat();

            // 6. Register Service Worker
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
                });
            }

        } catch (error) {
            console.error("Fatal initialization error:", error);
            showError(errorMessageContainer, `Fatal Error: The application could not start. ${error.message}. Please refresh the page or clear site data.`);
            toggleLoading(true, sendButton, chatInput, typingIndicator, chatLog);
            chatInput.placeholder = "Application disabled due to an error.";
        }
    }

    // --- Start Application ---
    main();