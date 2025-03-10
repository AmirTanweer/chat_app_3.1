const express=require('express');
const router=express.Router();
const Authentication=require('../middleware/Authentication')
const {fetchAllMessages,sendMessage}=require('../controllers/Message.Controller')
//Route 1 - Get all messages in a chat
router.get('/allmessages/:chatId',Authentication,fetchAllMessages)
//Route 2 - send a message to a chat
router.post('/sendmessage',Authentication,sendMessage)
module.exports=router;