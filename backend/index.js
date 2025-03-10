const express = require("express");

const connectDB = require("./db");
const cors = require("cors");

const UserRoute = require("./routes/User.Route");
const ChatRoute = require("./routes/Chat.Route");
const MessageRoute = require("./routes/Message.Route");
const { app ,server,io} = require("./socket");


const port = 5000;

connectDB();

app.use(express.json());
app.use(cors());



  
  

 

app.get("/", (req, res) => {
  res.send("Hello, this is Amir's chat app 3! hello world lkk");
}); 
 
app.use("/api/auth", UserRoute); 
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);

server.listen(port, () => { 
  console.log("🚀 Server is running on Port", port);
});
