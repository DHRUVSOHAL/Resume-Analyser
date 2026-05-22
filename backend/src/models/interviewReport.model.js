const mongoose=require("mongoose")


/**
 * job description
 * resume txt
 * self description
 * 
 * technical question
 * behavioural question :
 * skills gap :[]
 * preparation plain:[{}]
 */
const technicalQuestionSchema=new mongoose.Schema({
    question:{type:String,required:true},
    intention:{type:String,required:true},
    answer:{type:String,required:true}
},{_id:false})

const behaviouralQuestionSchema=new mongoose.Schema({
    question:{type:String,required:true},
    intention:{type:String,required:true},
    answer:{type:String,required:true}
},{_id:false})

const skillGapSchema=new mongoose.Schema({
    skill:{type:String,required:true},
    
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:true
    }
},{_id:false})

const preparationPlanSchema=new mongoose.Schema({
    day:{type:Number,required:true},
    focus:{
        type:String,
        required:true
    },
    tasks:[{
        type:String,
        required:true
    }]
},{_id:false})

const interviewReportSchema=new mongoose.Schema({
    jobDescription:{type:String,required:true},
    resumeText:{type:String},
    selfDescription:{type:String},
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behaviouralQuestions:[behaviouralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlans:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
})


const InterviewReportModel=mongoose.model("InterviewReport",interviewReportSchema)

module.exports=InterviewReportModel