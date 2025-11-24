
lucide.createIcons();


marked.setOptions({
    highlight: function (code, lang) {
        const language = highlight.getLanguage(lang) ? lang : 'plaintext';
        return highlight.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-',
});

const chatContainer = document.getElementById('chat-container');
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const emptyState = document.getElementById('empty-state');
const apiPagesView = document.getElementById('api-pages-view');

let isTyping = false;

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    if (textarea.value === '') {
        textarea.style.height = 'auto';
    }
}

function handleEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function showApiPages() {
    if (chatContainer) chatContainer.classList.add('hidden');
    const inputArea = document.getElementById('input-area');
    if (inputArea) inputArea.classList.add('hidden');
    if (apiPagesView) apiPagesView.classList.remove('hidden');
}

function showChat() {
    if (apiPagesView) apiPagesView.classList.add('hidden');
    if (chatContainer) chatContainer.classList.remove('hidden');
    const inputArea = document.getElementById('input-area');
    if (inputArea) inputArea.classList.remove('hidden');
}


function setInput(text) {
    userInput.value = text;
    autoResize(userInput);
    userInput.focus();
}


function handleModelChange() {
    const modelSelect = document.getElementById('model-select');
    const imageOptions = document.getElementById('image-options');
    const selectedModel = modelSelect ? modelSelect.value : 'default';

    if (selectedModel === 'deepimg' && imageOptions) {
        imageOptions.classList.remove('hidden');
    } else if (imageOptions) {
        imageOptions.classList.add('hidden');
    }



    // Update placeholder text
    if (userInput) {
        if (selectedModel === 'deepimg') {
            userInput.placeholder = 'Describe the image you want to generate...';
        } else {
            userInput.placeholder = 'Send a message...';
        }
    }
}

function appendMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `w-full border-b border-black/5 dark:border-slate-800/50 text-gray-800 dark:text-gray-100 group ${role === 'user' ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-950'}`;

    const innerDiv = document.createElement('div');
    innerDiv.className = 'text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = `w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`;

    if (role === 'user') {
        avatarDiv.innerHTML = '<i data-lucide="user" class="h-5 w-5 text-white"></i>';
    } else {
        avatarDiv.innerHTML = '<i data-lucide="bot" class="h-5 w-5 text-white"></i>';
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'relative flex-1 overflow-hidden break-words prose prose-invert max-w-none';

    if (role === 'user') {
        contentDiv.innerHTML = `<p>${content}</p>`;
    } else {
        contentDiv.innerHTML = content;
    }

    innerDiv.appendChild(avatarDiv);
    innerDiv.appendChild(contentDiv);
    messageDiv.appendChild(innerDiv);
    messagesDiv.appendChild(messageDiv);


    lucide.createIcons();

    return contentDiv;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || isTyping) return;


    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    appendMessage('user', text);
    userInput.value = '';
    userInput.style.height = 'auto';

    chatContainer.scrollTop = chatContainer.scrollHeight;

    isTyping = true;


    showLoadingButton();


    const thinkingHtml = `
        <div class="flex items-center gap-1 h-6">
            <span class="thinking-dot"></span>
            <span class="thinking-dot"></span>
            <span class="thinking-dot"></span>
        </div>
    `;
    const botContentDiv = appendMessage('assistant', thinkingHtml);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {



        const modelSelect = document.getElementById('model-select');
        const selectedModel = modelSelect ? modelSelect.value : 'default';


        const isImageModel = selectedModel === 'flux' || selectedModel === 'deepimg';

        if (isImageModel) {



            const styleSelect = document.getElementById('style-select');
            const selectedStyle = styleSelect ? styleSelect.value : 'default';

            const response = await fetch('/api/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: text,
                    model: selectedModel,
                    style: selectedStyle,
                    width: 512,
                    height: 512
                })
            });

            if (!response.ok) throw new Error('Image generation failed');

            const data = await response.json();
            botContentDiv.innerHTML = '';


            let imageUrl = data.images?.[0] || data.imageUrl;

            if (imageUrl) {
                botContentDiv.innerHTML = `
                    <div class="my-2">
                        <img src="${imageUrl}" alt="Generated image" class="rounded-lg max-w-full h-auto border border-slate-700" />
                        <p class="text-xs text-slate-500 mt-2">Generated with ${data.model}</p>
                    </div>
                `;
            } else {
                botContentDiv.innerHTML = '<p class="text-red-400">Failed to generate image</p>';
            }

        } else {

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, model: selectedModel })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            botContentDiv.innerHTML = '';


            let responseText = data.text;
            if (data.citations?.length > 0) {
                responseText += '\n\n**Sources:**\n';
                data.citations.forEach(cit => {
                    responseText += `- [${cit.title}](${cit.url})\n`;
                });
            }




            await typeText(botContentDiv, responseText);
        }

        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
        botContentDiv.innerHTML = `<p class="text-red-500">Sorry, something went wrong. Please try again.</p>`;
    }

    isTyping = false;
    hideLoadingButton();
    saveHistory();
}


function showLoadingButton() {
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i data-lucide="loader-2" class="h-4 w-4 animate-spin"></i>';
        lucide.createIcons();
    }

    if (userInput) {
        userInput.disabled = true;
        userInput.classList.add('opacity-50', 'cursor-not-allowed');
    }
}


function hideLoadingButton() {
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i data-lucide="send" class="h-4 w-4"></i>';
        lucide.createIcons();
    }

    if (userInput) {
        userInput.disabled = false;
        userInput.classList.remove('opacity-50', 'cursor-not-allowed');
        userInput.focus();
    }
}

async function typeText(element, text) {
    let currentText = '';
    const chars = text.split('');

    for (let i = 0; i < chars.length; i++) {
        currentText += chars[i];
        element.innerHTML = marked.parse(currentText);

        if (i % 5 === 0 || i === chars.length - 1) {
            element.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

        chatContainer.scrollTop = chatContainer.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
    }
    saveHistory();
}



const HISTORY_KEY = 'chat_history';
const resetModal = document.getElementById('reset-modal');

function saveHistory() {
    const messages = [];
    document.querySelectorAll('#messages > div').forEach(msgDiv => {


        // Check if the message is from user by looking at the avatar color
        const isUser = msgDiv.querySelector('.bg-blue-600') !== null;
        const content = msgDiv.querySelector('.prose').innerHTML;
        messages.push({
            role: isUser ? 'user' : 'assistant',
            content: content
        });
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
}

function loadHistory() {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
        const messages = JSON.parse(saved);
        if (messages.length > 0) {



            if (emptyState) {
                emptyState.classList.add('hidden');
            }
            messages.forEach(msg => {


                const messageDiv = document.createElement('div');
                messageDiv.className = `w-full border-b border-black/5 dark:border-slate-800/50 text-gray-800 dark:text-gray-100 group ${msg.role === 'user' ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-950'}`;

                const innerDiv = document.createElement('div');
                innerDiv.className = 'text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto';

                const avatarDiv = document.createElement('div');
                avatarDiv.className = `w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`;

                if (msg.role === 'user') {
                    avatarDiv.innerHTML = '<i data-lucide="user" class="h-5 w-5 text-white"></i>';
                } else {
                    avatarDiv.innerHTML = '<i data-lucide="bot" class="h-5 w-5 text-white"></i>';
                }

                const contentDiv = document.createElement('div');
                contentDiv.className = 'relative flex-1 overflow-hidden break-words prose prose-invert max-w-none';
                contentDiv.innerHTML = msg.content;

                innerDiv.appendChild(avatarDiv);
                innerDiv.appendChild(contentDiv);
                messageDiv.appendChild(innerDiv);
                messagesDiv.appendChild(messageDiv);
            });
            chatContainer.scrollTop = chatContainer.scrollHeight;
            lucide.createIcons();
        }
    }
}


function startNewChat() {
    if (!resetModal) return;
    resetModal.classList.remove('hidden');


    requestAnimationFrame(() => {
        resetModal.classList.remove('opacity-0');
        resetModal.querySelector('div').classList.remove('scale-95');
    });
}

function closeResetModal() {
    if (!resetModal) return;
    resetModal.classList.add('opacity-0');
    resetModal.querySelector('div').classList.add('scale-95');
    setTimeout(() => {
        resetModal.classList.add('hidden');
    }, 200);
}

async function confirmReset() {
    if (!resetModal) return;
    try {


        await fetch('/api/reset', { method: 'POST' });
        localStorage.removeItem(HISTORY_KEY);




        messagesDiv.innerHTML = '';
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        showChat();



        closeResetModal();

    } catch (error) {
        console.error('Reset failed:', error);
        alert('Failed to reset chat. Please try again.');
    }
}
async function loadPrompts() {
    try {
        const response = await fetch('/json/prompt.json');
        const prompts = await response.json();


        const shuffled = prompts.sort(() => 0.5 - Math.random());
        const selectedPrompts = shuffled.slice(0, 20);

        const carousel = document.getElementById('prompt-carousel');
        if (carousel) {
            carousel.innerHTML = '';


            const createCard = (prompt) => {
                const card = document.createElement('div');
                card.className = 'prompt-card group';
                card.onclick = () => setInput(prompt.title + ' ' + prompt.subtitle);

                card.innerHTML = `
                    <div class="font-medium text-gray-200 mb-1 group-hover:text-white transition-colors">${prompt.title}</div>
                    <div class="text-gray-500 text-xs group-hover:text-gray-400 transition-colors">${prompt.subtitle}</div>
                `;
                return card;
            };


            selectedPrompts.forEach(prompt => {
                carousel.appendChild(createCard(prompt));
            });


            selectedPrompts.forEach(prompt => {
                carousel.appendChild(createCard(prompt));
            });
        }
    } catch (error) {
        console.error('Failed to load prompts:', error);
    }
}



function showApiPages() {
    const chatArea = document.getElementById('chat-container');
    const apiPages = document.getElementById('api-pages-view');
    const inputArea = document.getElementById('input-area');

    if (chatArea) chatArea.classList.add('hidden');
    if (inputArea) inputArea.classList.add('hidden');
    if (apiPages) apiPages.classList.remove('hidden');


    lucide.createIcons();
}

function showChat() {
    const chatArea = document.getElementById('chat-container');
    const apiPages = document.getElementById('api-pages-view');
    const inputArea = document.getElementById('input-area');

    if (apiPages) apiPages.classList.add('hidden');
    if (chatArea) chatArea.classList.remove('hidden');
    if (inputArea) inputArea.classList.remove('hidden');


    lucide.createIcons();
}


document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
    loadHistory();
});
