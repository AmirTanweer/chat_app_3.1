const express=require('express')
const router=express.Router();
const Authentication=require('../middleware/Authentication')
const {accessChat,fetchChats,createGroupChat,renameGroup,addUserToGroup,removeUserFromGroup,fetchGroupChat} =require('../controllers/Chat.Controller')
//route -1 Create or fetch a one-on-one chat
router.post('/',Authentication,accessChat)
//route -2 Get all chats for a user 
router.get('/',Authentication,fetchChats)
 
//route -3  Create a new group chat
router.post('/group',Authentication,createGroupChat)
//route - 4 fetch group chat
router.get('/groupfetch/:chatId',Authentication,fetchGroupChat)
//route - 5 Rename a group chat
router.put('/rename',Authentication,renameGroup);
//route -6 Add a user to a group
router.put('/groupadd',Authentication,addUserToGroup)
//route -7 Remove a user from a group
router.put('/groupremove',Authentication,removeUserFromGroup)


module.exports=router;