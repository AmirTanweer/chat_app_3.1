const express=require('express')
const router=express.Router()
const Authentication=require('../middleware/Authentication')
const {registerUser,loginUser,getUser,getUsersWithoutChats}=require('../controllers/User.Controller')

router.use('/register',registerUser);
router.use('/login',loginUser);
router.use('/getuserdetails',Authentication,getUser)
router.use('/userswithoutchat',Authentication,getUsersWithoutChats)
module.exports=router;