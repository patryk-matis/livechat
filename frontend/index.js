const socket = io();
const text = document.querySelector('#textarea');
const typingMsg = document.querySelector('.typing-msg');
const messages = document.querySelector('.messages');

let username;
while(!username){
    username = prompt('What\'s your name');
}

socket.emit('join', username);

text.addEventListener('keyup', event => {
    if (event.key === 'Enter'){
        sendMessage(event.target.value);
    }

    socket.emit('typing', {isTyping: text.value.length > 0, name: username});
});


const sendMessage = (msg => {
    msg = msg.trim();
    if (msg.length > 1){
        const messageInfo = {
            user: username,
            message: msg
        };
    
        socket.emit('message', messageInfo);
        positionMessage(messageInfo, 'outgoing');
    }
    else {
        alert("Your message must contain at least 2 characters.");
    }
    text.value = '';
});

const systemMessage = ((username, event) => {
    const message = {
        user: "SpookChat",
        message: username + event
    };

    positionMessage(message, 'system');
})


const positionMessage = ((msg, type) => {
    const div = document.createElement('div');
    div.classList.add('messages--'+type);

    const newElem = `
        <h3>${msg.user}</h3>
        <p>${msg.message}</p>
    `;

    div.innerHTML = newElem;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;
});


socket.on('message', msg => {
    positionMessage(msg, 'incoming');
});

socket.on('typing', user => {
    if (user.isTyping){
        typingMsg.innerHTML = `${user.name} is typing...`;
    } else{
        typingMsg.innerHTML = "";
    }
});

socket.on('join', (user) => {
    systemMessage(user, " has joined the chat");
});

socket.on('user left', (user) => {
    systemMessage(user, " has left the chat");
});