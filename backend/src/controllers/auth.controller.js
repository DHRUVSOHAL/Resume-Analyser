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

        // 6. Abhi ke liye terminal mein print kar rahe hain testing ke liye
        console.log(`\n📩 [TESTING] OTP sent to ${email} -> PLAIN OTP: ${plainOTP}\n`);

        // TODO: Yahan Nodemailer ka mail function call hoga jisme plainOTP jayega
        await sendOTPEmail(email, plainOTP);
        // 7. Success response return karna mat bhoolna!
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
        const { email, otp } = req.body; // Frontend ya Postman se plain OTP aur email aayega

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email aur OTP dono zaroori hain!" });
        }

        // 1. DB se is email ka latest OTP record find karo
        const otpRecord = await otpModel.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP expire ho chuka hai ya galat email hai. Naya OTP request karein." 
            });
        }

        // 2. Plain OTP ko DB wale hashed OTP se compare karo
        const isMatch = await bcrypt.compare(otp, otpRecord.otp);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Galat OTP hai! Kripya check karke dubara dalein." });
        }

        // 3. OTP sahi hai! Isko reuse hone se rokne ke liye DB se delete kar do
        await otpModel.deleteOne({ _id: otpRecord._id });

        // 4. Success Response: Yahan hum frontend ko batayenge ki verification done hai
        return res.status(200).json({ 
            success: true, 
            message: "OTP verification safal raha! Ab aap aage badh sakte hain." 
        });

    } catch (error) {
        console.error("Error in verifyOtp:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgetPassword,
    verifyOtp
}