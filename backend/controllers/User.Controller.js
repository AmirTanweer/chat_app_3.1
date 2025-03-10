const mongoose=require('mongoose')
const {validationResult,body}=require('express-validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/User.model')
const dotenv=require('dotenv')
dotenv.config();
const registerUser= async(req,res)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try{

        const {name,email,password}=req.body
        let user=await User.findOne({email})

    if (user) {
            return res.status(401).json({ message: "User already exists" });
      }
      const salt=await bcrypt.genSalt(10)
      const hashedPassword= await bcrypt.hash(password,salt)
    user=new User({
        name:name,
        email:email,
        password:hashedPassword  
    })
    await user.save()
    res.status(201).json({message:"User Created Successfully"});
}
catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
const loginUser=async(req,res)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try{
        const {email,password}=req.body
        let user=await User.findOne({email})
        if(!user){
            res.status(404).json({error:"Unauthorized Access"});
        }
        let hashedPassword=user.password
        let checkPassword=await bcrypt.compare(password,hashedPassword)
        if(!checkPassword){
            return res.status(404).json({error:"Unauthorized Access"});
        }
        const payload={
            
                userId:user.id
            
        }
        const token=jwt.sign(payload,process.env.SECRET);
        res.status(200).json({message:"Login Successfully",token})
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
}
const getUser=async(req,res)=>{
    const myId=req.user
    let user=await User.findById(myId).select('-password')
    if(!user){
        res.status(404).json({error:"Unauthorized Access"});
    }

   res.status(200).json({user})
}
module.exports={registerUser,loginUser,getUser}