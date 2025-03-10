const mongoose=require('mongoose')
const Chat=require('../models/Chat.model')
const {validationResult}=require('express-validator');
const accessChat=async(req,res)=>{
    const errors=validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
        try{
 const {userId}= req.body
 const myId=req.user

  if(!userId){
    return res.status(400).json({message:"User ID is required"});
  }

 // Find if a chat between these two users already exists
 let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [myId, userId] },
  }).populate("users", "-password").populate("latestMessage");
 
  if (chat) {
    return res.status(200).json(chat);
  }

  // If no chat exists, create a new one
  const newChat = await Chat.create({
    isGroupChat: false,
    users: [myId, userId],
  });
  

  const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
  res.status(201).json(fullChat);
}
catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
 
}
const fetchChats=async(req,res)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try{
  const myId=req.user

const chats = await Chat.find({ users: myId })
.populate("users", "-password")
.populate("groupAdmin", "-password")
.populate("latestMessage")
.sort({ updatedAt: -1 }); // Sort by latest message
  res.status(200).json(chats);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
}
const createGroupChat=async(req,res)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try{ 
        const myId = req.user; // Assuming authentication middleware sets req.user
        const { chatName, users } = req.body; // Express automatically parses JSON

        if (!users || !chatName) {
            return res.status(400).json({ message: "Please provide chatName and users" });
        }

        if (users.length < 2) {
            return res.status(400).json({ message: "A group chat needs at least 2 members" });
        }

        users.push(myId);

        let groupChat = await Chat.create({
            chatName: chatName,
            isGroupChat: true,
            users: users,
            groupAdmin: myId
        });
          const fullChats=await Chat.findById(groupChat._id).populate('users',"-password").populate('groupAdmin',"-password")

        res.status(201).json(fullChats);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
}
const renameGroup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const myId = req.user;  // Ensure user ID is extracted correctly
        console.log("myId -> ", myId);

        const { chatId, chatName } = req.body;

        // Validate chatName is provided
        if (!chatName || chatName.trim() === "") {
            return res.status(400).json({ message: "Chat name cannot be empty" });
        }

        let groupChat = await Chat.findById(chatId);
        if (!groupChat) {
            return res.status(404).json({ message: "No group found" });
        }

        // Fix ObjectID comparison
        if (groupChat.groupAdmin._id.toString() !== myId.toString()) {
            return res.status(403).json({ message: "Access Denied" });
        }

        // Update the group chat name
        let updatedGroupChat = await Chat.findByIdAndUpdate(
            chatId,
            { chatName: chatName },
            { new: true } // Ensure we get the updated document
        ).populate('users','-password').populate('groupAdmin','-password')

       
        res.status(200).json(updatedGroupChat);
    } catch (error) {
        console.error("Error renaming group:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const addUserToGroup=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
         const myId=req.user
         const {userId,chatId}=req.body
         if(!userId || !chatId){
            return res.status(400).json({message:"Please provide valid userId and chatId"})
         }
         let groupChat=await Chat.findById(chatId)
         if(!groupChat){
            return res.status(400).json({message:"No group present with this chatId"})
         }

         if (groupChat.groupAdmin._id.toString() !== myId.toString()) {
            return res.status(403).json({ message: "Access Denied" });
        }
        // Check if user is already in the group
        const isUserInGroup = groupChat.users.some(user => user._id.toString() === userId);
        if (isUserInGroup) {
            return res.status(403).json({ message: "User already a group member" });
        }

          let updatedGroupChat= await Chat.findByIdAndUpdate(chatId,
            { $addToSet: { users: userId } }, // MongoDB ensures no duplicate entries
            {new:true}
        ).populate('users','-password').populate('groupAdmin',"-password")
         console.log(updatedGroupChat)
         res.status(201).json(updatedGroupChat)
 
    } catch (error) {
        console.error("Error renaming group:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
const removeUserFromGroup=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try {
        const myId=req.user;
       const {userId,chatId}=req.body
       if(!userId || !chatId){
            return res.status(400).json({message:"Please provide valid userId and chatId"})
         }
         let groupChat=await Chat.findById(chatId)
         if(!groupChat){
            return res.status(400).json({message:"No group present with this chatId"})
         }

         if (groupChat.groupAdmin._id.toString() !== myId.toString()) {
            return res.status(403).json({ message: "Access Denied" });
        }

    // Prevent admin from removing themselves
    if (userId === myId.toString()) {
        return res.status(403).json({ message: "Admin cannot remove themselves" });
    }

        // Check if user is already in the group
        const isUserInGroup = groupChat.users.some(user => user._id.toString() === userId);
        if (!isUserInGroup) {
            return res.status(400).json({ message: "User is not in this group" });
        }
        let updatedGroupChat=await Chat.findByIdAndUpdate(chatId,
            { $pull: { users: userId } }, // Remove userId from users array
            {new :true}
    ).populate('users','-password').populate('groupAdmin',"-password");
    res.status(201).json(updatedGroupChat) 

    } catch (error) {
        console.error("Error renaming group:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addUserToGroup,removeUserFromGroup}