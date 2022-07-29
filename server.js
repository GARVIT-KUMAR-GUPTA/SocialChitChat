const path=require('path');
const express= require('express');
const http=require('http');
const app=express();
const server=http.createServer(app);
const formatmessage=require('./utilis/message.js')
const {userJoin ,getCurrentUser,userLeave,getRoomUseres}=require('./utilis/users')
const socketio=require('socket.io');

app.use(express.static(path.join(__dirname,'public')));

const io=socketio(server);
const botName="App Bot";
io.on('connection',socket =>{
    //console.log("User connected");
    const i=socket.id;
    socket.on('joinRoom',({username,room})=>{

        const user=userJoin(socket.id,username,room);
        socket.join(user.room);

        socket.emit('message',formatmessage(botName,"Welcome to my chat app!"));

        socket.broadcast.to(user.room).emit('message',formatmessage(botName,`${user.userName} has joined the chat`));
        
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUseres(user.room)
        })
    })
    // welcome new user
    socket.on('chatMessage',message=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatmessage(user.userName,message));
    })
    
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatmessage(botName,`${user.userName} has left the chat`));
        }
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUseres(user.room)
        })
    })
});

const PORT=3000|| process.env.PORT;

server.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)});