const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



async function authUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token."
        })
    }

}

const verifyResetToken = (req, res, next) => {
    // 🔥 यहाँ हम 'resetToken' नाम की कुकी निकाल रहे हैं
    const token = req.cookies.resetToken; 

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Access Denied. Session expire ho gaya hai, dubara OTP verify karein." 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 🔥 सिक्योरिटी चेक: क्या यह सच में रिसेट टोकन ही है?
        if (decoded.purpose !== "reset-password") {
            return res.status(403).json({ 
                success: false, 
                message: "Invalid token purpose. Security alert!" 
            });
        }

        req.user = decoded; // इसमें { id: user._id, purpose: "reset-password" } आ जाएगा
        next();
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid or expired reset token. Kripya dubara OTP verify karein." 
        });
    }
};



module.exports = { authUser,verifyResetToken }