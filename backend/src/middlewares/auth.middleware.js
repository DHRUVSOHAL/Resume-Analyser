const jwt=require("jsonwebtoken")

const tokenBlackListModel=require("../models/blackList.model.js")

async function authUser(req,res,next){
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:"token not found, please login"})
    }
    const ifTokenBlackListed=await tokenBlackListModel.findOne({token})
    if(ifTokenBlackListed){
        return res.status(401).json({message:"token is invalid"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=decoded
        next()
    }
    catch(err){
        return res.status(401).json({message:"invalid token, please login again"})
    }
}

module.exports={authUser}