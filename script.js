const input = document.querySelector('#input');
const chatContainer = document.querySelector('#chat-container');
const askBtn = document.querySelector('#ask');

input?.addEventListener('keyup', handleEnter);
askBtn?.addEventListener('click', handleAsk);

async function generate(text){

/** 
 * 1. append message to UI
 * 2. send it to the llm
 * 3. get the response and append it to UI
 * 
 *  **/

    const msg = document.createElement('div');
    msg.className = 'my-6 bg-neutral-800 p-3 rounded-xl ml-auto w-fit ';
    msg.textContent = text;
    chatContainer?.appendChild(msg);
    input.value = '';

    // Show loader
    showLoader();

    //call server
    try {
        const assistantMessage = await callServer(text);
        
        // Hide loader
        hideLoader();
        
        const assistantMsgElem = document.createElement('div');
        assistantMsgElem.className = 'max-w-fit my-6 bg-neutral-700 p-3 rounded-xl';
        assistantMsgElem.textContent = assistantMessage;
        chatContainer?.appendChild(assistantMsgElem);
        
        console.log('assistantMessage:', assistantMessage);
    } catch (error) {
        // Hide loader on error
        hideLoader();
        
        const errorMsgElem = document.createElement('div');
        errorMsgElem.className = 'max-w-fit my-6 bg-red-600 p-3 rounded-xl text-white';
        errorMsgElem.textContent = 'Error: Unable to get response';
        chatContainer?.appendChild(errorMsgElem);
        
        console.error('Error:', error);
    }
    
    // Auto scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show loading indicator
function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'typing-loader';
    loader.className = 'max-w-fit my-6 bg-neutral-700 p-3 rounded-xl flex items-center space-x-2';
    loader.innerHTML = `
        <div class="flex space-x-1">
            <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
        <span class="text-neutral-300 text-sm ml-2">AI is thinking...</span>
    `;
    chatContainer?.appendChild(loader);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Hide loading indicator
function hideLoader() {
    const loader = document.getElementById('typing-loader');
    if (loader) {
        loader.remove();
    }
}

async function callServer(inputText){
    const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputText })
    }); 

    if (!response.ok) {
        throw new Error('Error generating response ');
    }

    const data = await response.json();
    return data.message;
}

async function handleAsk(e){
    const text = input?.value.trim();
    if(!text) return;
    await generate(text); 
}

async function handleEnter(e) {
    if(e.key === 'Enter' ){
        const text = input?.value.trim();
        if(!text) return;

        await generate(text);
    }
}