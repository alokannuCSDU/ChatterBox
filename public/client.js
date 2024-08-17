const socket = io();
let naam;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let sendButton = document.getElementById('sendButton');

// Prompt for the user's name
do {
    naam = prompt('Naam Btao Apna:');
} while (!naam);

// Send message on Enter key press and shift + Enter for a new line
textarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (e.shiftKey) {
            // Allow new line with Shift + Enter
            return;
        } else {
            e.preventDefault();
            sendMessage(textarea.value);
        }
    }
});

// Send message on send logo click
sendButton.addEventListener('click', () => {
    sendMessage(textarea.value);
});

function sendMessage(message) {
    const trimmedMessage = message.trim();
    if (trimmedMessage === '') {
        return; // Prevent sending empty messages
    }

    let msg = {
        user: naam,
        message: trimmedMessage
    };

    // Append the message to the message area
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Send the message to the server
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');

    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

// Receive incoming messages
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
