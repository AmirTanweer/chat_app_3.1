const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true,
    }, 
    password:{
        type:String,
        required:true,
    },
    profilePic:{
       type:String,
       default: "https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"
    }

},
{timestamps:true}

)
module.exports=mongoose.model('User',userSchema)