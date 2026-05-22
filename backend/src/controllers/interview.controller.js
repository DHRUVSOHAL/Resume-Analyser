const pdfParse = require("pdf-parse");

const { generateInterviewReport } = require("../services/ai.service.js");

const InterviewReportModel = require("../models/interviewReport.model.js");

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

module.exports = {
    generateInterviewReportController
};