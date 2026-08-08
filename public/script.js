const promptInput = document.getElementById('promptInput');
const mainArea = document.getElementById('mainArea');
const chatContainer = document.getElementById('chatContainer');
let isFirstMessage = true;

promptInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && promptInput.value.trim() !== '') {
        const text = promptInput.value.trim();
        promptInput.value = ''; // Clear input

        // 1. Trigger Layout Change on First Message
        if (isFirstMessage) {
            mainArea.classList.remove('center-layout');
            mainArea.classList.add('chat-layout');
            isFirstMessage = false;
        }

        // 2. Add User Message to UI
        addMessage('You', text, 'user');

        // 3. Fetch Response from server.js
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });
            
            const data = await response.json();
            
            if (data.success) {
                addMessage('ChudBot', data.text, 'bot');
            } else {
                addMessage('System', 'Error: ' + data.text, 'bot');
            }
        } catch (error) {
            console.error("Fetch error:", error);
            addMessage('System', 'Failed to connect to backend.', 'bot');
        }
    }
});

function addMessage(sender, text, type) {
    // Create outer row
    const row = document.createElement('div');
    row.className = `message-row ${type}`;
    
    // Create inner content wrapper
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Create sender label
    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = `${sender}:`;
    
    // Create message text
    const messageBody = document.createElement('div');
    messageBody.className = 'message-body';
    messageBody.textContent = text;
    
    // Assemble and append
    content.appendChild(label);
    content.appendChild(messageBody);
    row.appendChild(content);
    chatContainer.appendChild(row);
    
    // Auto-scroll to the newest message
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
