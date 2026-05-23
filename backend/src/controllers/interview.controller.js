const pdfParse = require("pdf-parse");

const { generateInterviewReport } = require("../services/ai.service.js");

const InterviewReportModel = require("../models/interviewReport.model.js");
const { findOneAndUpdate } = require("../models/blackList.model.js");

async function generateInterviewReportController(req, res) {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required"
            });
        }

        const parsedPdf = await (
            new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            )
        ).getText();

        const resumeContent = parsedPdf.text;

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAI = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        });

        if (!interviewReportByAI) {
            return res.status(500).json({
                message: "AI failed to generate report"
            });
        }

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAI
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

/**
 * @description get interview report by interviewId
 * @access private
 */
async function generateInterviewReportByIdController(req,res){
    const {interviewId}=req.param
    const interviewReport=await InterviewReportModel.findOne({_id:interviewId,user:req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview Report not found"
        })
    }
    else{
        res.status(200).json({
            message:"Interview report fetched successfully",
            interviewReport
        })
    }
}
/**
 * @description controlller to get all interview of logged in user
 * 
 */
async function generateAllInterviewReportController(req, res) {
    try {

        const interviewReports = await InterviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select(
                "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
            );

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}
module.exports = {
    generateInterviewReportController,
    generateInterviewReportByIdController,
    generateAllInterviewReportController
};