require("dotenv").config()

const app=require("./src/app")

const {
    resumeText,
    selfDescription,
    jobDescription
}=require("./src/services/temp.js")

const {
    generateInterviewReport
}=require("./src/services/ai.service.js")

const connectDB=require("./src/config/db.js")

connectDB()

generateInterviewReport({
    resume:resumeText,
    selfDescription,
    jobDescription
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})