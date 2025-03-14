const {Server} = require('socket.io')
const http=require('http');
const express=require('express')
 const Message=require('./models/Message.model')
const app=express();
 
// Create an HTTP server
const server=http.createServer(app);

// Initialize socket.io with CORS
const io=new Server(server,{
    cors:{
        origin: ['http://localhost:3000'],
    }
})

module.exports=function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//used to store online users
const userSocketMap={} // {userId:socketId}

io.on('connection',(socket)=>{
    console.log("User Connected : ",socket.id);

   const userId=socket.handshake.query.userId
   
   if(userId) userSocketMap[userId]=socket.id

   //io.emit() is used to send events to all the connected clients
    // Notify all users about the updated online users
   io.emit('getOnlineUsers',Object.keys(userSocketMap));

   // ✅ Join Room when a chat is selected
   socket.on('joinRoom', (chatId) => {
    socket.join(chatId);   // Join the specific chat room
    console.log(`User ${socket.id} joined room: ${chatId}`);
});

   //Handle message sending
   socket.on('message', async (msg,senderId,chatId)=>{
    console.log('Received message:',msg);
    console.log('Received senderId:',senderId);
    console.log('Received chatId:',chatId);
 
    //   Save the message in the database
    //   const newMessage = await Message.create({
    //     sender: senderId,
    //     content: msg,
    //     chat: chatId,
    // });

    //Broadcast the message to the specific chat room
    io.to(chatId).emit('newMessage',msg);    
    // io.emit('newMessage',newMessage) 
    
   })

    socket.on('disconnect',()=>{
        console.log("User Disconnected : ",socket.id)
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
}) 


module.exports ={io,app,server};