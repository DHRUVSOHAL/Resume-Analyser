const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const otpModel = require("../models/Otp.model")
const { sendOTPEmail } = require('../services/Email.service');
const crypto = require('crypto');

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    })


    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)



    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @route POST /api/auth/forget-password
 * @description  it will take email as input and send otp and match
 * @access private
 */

async function forgetPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email required hai!" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(440).json({
                success: false,
                message: "Khaata nahi mila! Pehle register karein."
            });
        }
        const plainOTP = crypto.randomInt(100000, 999999).toString();
        const hash = await bcrypt.hash(plainOTP, 10);

        await otpModel.findOneAndDelete({ email });
        await otpModel.create({
            email: email,
            otp: hash
        });

       
        console.log(`\n📩 [TESTING] OTP sent to ${email} -> PLAIN OTP: ${plainOTP}\n`);

        
        await sendOTPEmail(email, plainOTP);
        
        return res.status(200).json({
            success: true,
            message: "OTP aapke email par bhej diya gaya hai."
        });

    } catch (error) {
        console.error("Error in forgetPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}
async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email aur OTP dono zaroori hain!" });
        }

       
        const otpRecord = await otpModel.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP expire ho chuka hai ya galat email hai. Naya OTP request karein."
            });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Galat OTP hai! Kripya check karke dubara dalein." });
        }

        
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(444).json({ success: false, message: "User nahi mila!" });
        }

    
        const resetToken = jwt.sign(
            {
                id: user._id,
                purpose: "reset-password" 
            },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );
        res.cookie("resetToken", resetToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 10 * 60 * 1000 
        });

        await otpModel.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            success: true,
            message: "OTP verification safal raha! Ab aap password badal sakte hain.",
        });

    } catch (error) {
        console.error("Error in verifyOtp:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}


/**
 * @name resetPassword
 * @description Reset user password after valid OTP token verification
 * @access Protected (via verifyResetToken middleware)
 */

async function resetPassword(req, res) {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: "Naya password dalna zaroori hai!"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password kam se kam 6 characters ka hona chahiye."
            });
        }

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User nahi mila!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        
        user.password = hashedPassword;
        await user.save();

        res.clearCookie("resetToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 // 1 din
        });

        return res.status(200).json({
            success: true,
            message: "Password badal gaya hai aur aap login ho chuke hain!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgetPassword,
    verifyOtp,
    resetPassword
}