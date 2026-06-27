const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)


/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.post("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)



/**
 * @route POST /api/auth/forget-password
 * @description  it will take email as input and send otp and match
 * @access private
 */

authRouter.post("/forget-password",authController.forgetPassword)
/**
 * @route POST /api/auth/verify-otp
 * @description it will take otp and email 
 * @access private
 */

authRouter.post("/verify-otp",authController.verifyOtp)
module.exports = authRouter