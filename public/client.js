const socket = io();
let naam;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let sendButton = document.getElementById('sendButton');
let emojiButton = document.getElementById('emojiButton');
let emojiPicker = document.getElementById('emojiPicker');

// Prompt for the user's name
do {
    naam = prompt('Naam Batao Apna:');
} while (!naam);

// Notify server that a new user has joined
socket.emit('new-user-joined', naam);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        sendMessage(e.target.value);
    }
});

sendButton.addEventListener('click', () => {
    sendMessage(textarea.value);
});

emojiButton.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
});

emojiPicker.addEventListener('click', (e) => {
    if (e.target.classList.contains('emoji')) {
        textarea.value += e.target.getAttribute('data-emoji');
        emojiPicker.style.display = 'none';
    }
});

function sendMessage(message) {
    if (message.trim() === '') return; // Avoid sending empty messages
    let msg = {
        user: naam,
        message: message.trim()
    };

    // Append
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Send to server
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

// Receive message from server
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

// Receive notification when a new user joins
socket.on('user-joined', (notification) => {
    let joinDiv = document.createElement('div');
    joinDiv.classList.add('join-message');

    let joinMarkup = `
    <p><em>${notification}</em></p>
    `;
    joinDiv.innerHTML = joinMarkup;
    messageArea.appendChild(joinDiv);
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
