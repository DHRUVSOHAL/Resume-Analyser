const {Router}=require('express')

const authRouter=Router()

/**
 
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 * 
 */
const authController=require("../controllers/auth.controller")
authRouter.post('/register',authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post('/login',authController.loginUserController)
 
/**
 * @route   GET /api/auth/logout
 * @description Logout a user
 * @access Public
 */
authRouter.get('/logout',authController.logoutUserController)

module.exports=authRouter