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
/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get('/report/:interviewId',authMiddleware.authUser,interviewController.generateInterviewReportByIdController)

/**
 * @route get /api/interview/
 * @description get all reports of logged in user
 * @access private
 */


interviewRouter.get('/',authMiddleware.authUser,interviewController.generateAllInterviewReportController)

module.exports=interviewRouter