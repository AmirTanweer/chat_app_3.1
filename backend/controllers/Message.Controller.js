const {validationResult}=require('express-validator');
const Message=require('../models/Message.model')
const Chat=require('../models/Chat.model')
const fetchAllMessages=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

      const {chatId}=req.params
      console.log(chatId)
      const messages=await Message.find({chat:chatId}).populate("sender","name email").populate("chat")
      res.status(200).json(messages);

    } catch (error) {
        console.error("Error renaming group:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const sendMessage=async(req,res)=>{
 const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try {
    const myId=req.user
    const {chatId,content}=req.body
    if (!chatId || !content) {
        return res.status(400).json({ message: "Chat ID and message content are required" });
      }
      let message=await Message.create({
        sender:myId,
        content:content,
        chat:chatId
 
      })
      const fullMessage=await Message.findById(message._id).populate('sender','name email').populate('chat');
      console.log("message -> ",fullMessage)
      await Chat.findByIdAndUpdate(chatId,{latestMessage:fullMessage})
      res.status(201).json(fullMessage)

  } catch (error) {
        console.error("Error renaming group:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
    
}
module.exports={fetchAllMessages,sendMessage}