const userModel=require("../models/user.model.js")
const bcrypt = require('bcrypt');
const tokenBlacklistModel=require("../models/blacklist.model.js")
const jwt=require("jsonwebtoken")
/**
 * @name register
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUserController(req, res) {
    // Implementation for user registration
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const isUserExist=await userModel.findOne({ 
        $or:[{username},{email}]
     });
     if(isUserExist){
        return res.status(400).json({ message: "Username or Email already exists" });
     }
    const hash=await bcrypt.hash(password,10);
    // now creating user
    const user=await userModel.create({
        username,
        email,
        password:hash
    })
    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET_KEY,
        {expiresIn:"1d"}
    )
    res.cookie("token",token)
    res.status(201).json({ message: "User registered successfully" 
        ,user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    });
    
}

/**
 * @name:login controller
 * @description:login a user ,expecting email and password in the request body
 * @access:public
 */
async function loginUserController(req,res){
    const{ email ,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message:"Invalid email or password"})
    }
    const isPasswordMatch=await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid email or password"})
    }
    const token=jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET_KEY
        ,{expiresIn:"1d"}
    )
    res.cookie("token",token)
    res.status(200).json({message:"Login successful",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}
/** * @name:logout controller
 * @description:logout a user by clearing the token cookie
 * @access:public
    */
  async function logoutUserController(req,res){
  const token=req.cookies.token
  if(!token){
    return res.status(400).json({message:"User is not logged in"})
  }
    // Add the token to blacklist
    await tokenBlacklistModel.create({token})
    res.clearCookie("token")
    res.status(200).json({message:"Logout successful"})

}
/**
 * @name: getMeController
 * @description: get the current logged in user
 * @access: private
 */
async function getMeController(req,res){
    const user=await userModel.findById(req.user.id)
    res.status(200).json({
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}