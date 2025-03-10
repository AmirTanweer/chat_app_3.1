const express=require('express')
const router=express.Router()
const Authentication=require('../middleware/Authentication')
const {registerUser,loginUser,getUser}=require('../controllers/User.Controller')

router.use('/register',registerUser);
router.use('/login',loginUser);
router.use('/getuserdetails',Authentication,getUser)

module.exports=router;