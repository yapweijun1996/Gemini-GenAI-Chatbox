const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-slate-400"><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd"></path></svg>`;
const aiIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-slate-400"><path fill-rule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3.375a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75z" clip-rule="evenodd"></path></svg>`;
const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`;
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`;

function scrollToBottom(chatLog) {
    chatLog.scrollTop = chatLog.scrollHeight;
}

function showError(errorMessageContainer, message) {
    errorMessageContainer.innerHTML = `<p><strong>Oops! Something went wrong.</strong></p><p>${message}</p>`;
    errorMessageContainer.classList.remove('hidden');
}

function toggleLoading(isLoading, sendButton, chatInput, typingIndicator, chatLog) {
    sendButton.disabled = isLoading;
    chatInput.disabled = isLoading;
    if (isLoading) {
        typingIndicator.classList.remove('hidden');
        scrollToBottom(chatLog);
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

function appendMessage(chatLog, message) {
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
    scrollToBottom(chatLog);
    return messageId;
}

export {
    scrollToBottom,
    showError,
    toggleLoading,
    addCopyButtons,
    appendMessage
};