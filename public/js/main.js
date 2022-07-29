const socket=io();
const chatForm=document.getElementById('chat-form');
const chatMessage=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

const {username, room}= Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
console.log(room);
socket.emit('joinRoom',{username, room});
socket.on('roomUsers',({room,users})=>{
    outputRoom(room);
    outputUsers(users);
})
socket.on('message',message=>{
    console.log(message.text);
    outputMessage(message);
    chatMessage.scrollTop=chatMessage.scrollHeight;
})

 chatForm.addEventListener('submit',e=>{
    e.preventDefault();
    //const message=e.target.
    const message=e.target.elements.msg.value;
    console.log();
    socket.emit('chatMessage',message);
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();
 })

 function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.user}<span>${message.time}</span></p>
    <p class="text">
        ${message.text};
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
 }
 function outputRoom(room){
    roomName.innerText=room;
 }
 function outputUsers(users){
    userList.innerHTML=`${users.map(user=> `<li>${user.username}</li>`).join('')}`;
 }