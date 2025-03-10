const express=require('express')
const router=express.Router();
const Authentication=require('../middleware/Authentication')
const {accessChat,fetchChats,createGroupChat,renameGroup,addUserToGroup,removeUserFromGroup} =require('../controllers/Chat.Controller')
//route -1 Create or fetch a one-on-one chat
router.post('/',Authentication,accessChat)
//route -2 Get all chats for a user 
router.get('/',Authentication,fetchChats)
//route -3  Create a new group chat
router.post('/group',Authentication,createGroupChat)
//route - 4 Rename a group chat
router.put('/rename',Authentication,renameGroup);
//route -5 Add a user to a group
router.put('/groupadd',Authentication,addUserToGroup)
//route -6 Remove a user from a group
router.put('/groupremove',Authentication,removeUserFromGroup)

module.exports=router;