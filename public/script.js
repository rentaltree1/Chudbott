const chatInput = document.getElementById('chatInput');
const mainArea = document.getElementById('mainArea');
const chatContainer = document.getElementById('chatContainer');
let isFirstMessage = true;

chatInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && chatInput.value.trim() !== '') {
        const text = chatInput.value.trim();
        chatInput.value = '';

        // Trigger layout shift on the very first message
        if (isFirstMessage) {
            mainArea.classList.remove('initial');
            mainArea.classList.add('chatting');
            isFirstMessage = false;
        }

        // Display user's message
        appendMessage('You', text, 'user-message');

        try {
            // Send request to the backend API defined in server.js
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });
            
            const data = await response.json();
            
            // Display bot's response
            if (data.success) {
                appendMessage('ChudBot', data.text, 'bot-message');
            } else {
                appendMessage('System', 'Error: ' + data.text, 'bot-message');
            }
        } catch (err) {
            console.error(err);
            appendMessage('System', 'Connection failed. Is the server running?', 'bot-message');
        }
    }
});

// Function to generate chat bubbles dynamically
function appendMessage(sender, text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = `${sender}:`;
    
    const contentDiv = document.createElement('div');
    contentDiv.textContent = text;
    
    msgDiv.appendChild(labelDiv);
    msgDiv.appendChild(contentDiv);
    chatContainer.appendChild(msgDiv);
    
    // Auto-scroll to the newest message
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
