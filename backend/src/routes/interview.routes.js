const express=require('express')

const authMiddleware=require("../middlewares/auth.middleware.js")
const interviewRouter=express.Router()

const upload=require("../middlewares/file.middleware.js")

const interviewController=require("../controllers/interview.controller.js")

/**
 * @route Post /api/interview/
 * @description generate new interview report on the basis of user self description resume pdf and job description
 * @access private
 */

interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

module.exports=interviewRouter