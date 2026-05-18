const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:[true
,        "Username already exists! Please choose a different username."]
        ,
        required:[true, "Username is required!"]
},
    email:{
        type:String,
        required:true,
        unique:[true, "Email already exists! Please choose a different email."],
        required:[true, "Email is required!"]
    },
    password:{
        type:String,
        required:true
    }
})

const userModel=mongoose.model("User",userSchema);
module.exports=userModel;