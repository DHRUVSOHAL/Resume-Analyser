const { GoogleGenAI } = require("@google/genai");

const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

async function invokeGeminiAI() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: "Hello Gemini: what is interview?"
        });

        console.log(response.text);
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Different schema from DB
const interviewReportSchema = z.object({
    matchScore: z.number().describe(
        "A score between 0 to 100 indicating how well the candidate's profile matches the job description"
    ),

    technicalQuestions: z.array(
        z.object({
            question: z.string().describe(
                "The technical question that can be asked in interview"
            ),

            intention: z.string().describe(
                "The intention of interviewer behind this question"
            ),

            answer: z.string().describe(
                "How to answer this question, what points to cover, what approach to take etc."
            )
        })
    ).describe(
        "Technical questions that can be asked in the interview along with intention and answer guidance"
    ),

    behaviouralQuestions: z.array(
        z.object({
            question: z.string().describe(
                "The behavioural question that can be asked in interview"
            ),

            intention: z.string().describe(
                "The intention of interviewer behind this question"
            ),

            answer: z.string().describe(
                "How to answer this question, what points to cover, what approach to take etc."
            )
        })
    ).describe(
        "Behavioural questions that can be asked in the interview along with intention and answer guidance"
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string().describe(
                "The skills which candidate is lacking"
            ),

            severity: z.enum(["low", "medium", "high"]).describe(
                "The severity of the skill gap"
            )
        })
    ).describe(
        "List of skill gaps in candidate profile along with severity"
    ),

    preparationPlans: z.array(
        z.object({
            day: z.number().describe(
                "The day number in the preparation plan starting from 1"
            ),

            focus: z.string().describe(
                "The main focus of the preparation plan"
            ),

            tasks: z.array(z.string()).describe(
                "List of tasks to complete on this day"
            )
        })
    ).describe(
        "A day wise preparation plan for the candidate"
    )
});
async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    try {

        const prompt = `
You are an API.

Return ONLY valid JSON.

Do not add markdown.
Do not add explanation.
Do not add extra fields.

Return EXACTLY this structure:

{
  "matchScore": number,

  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],

  "behaviouralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],

  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],

  "preparationPlans": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ]
}

Generate at least:
- 5 technical questions
- 3 behavioural questions
- 3 skill gaps
- 5 preparation plan days

Candidate Details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,

            config: {
                responseMimeType: "application/json"

            }
        });

        

        const parsedData = interviewReportSchema.parse(
            JSON.parse(response.text)
        );

        

        return parsedData;

    } catch (error) {

        console.error("Error generating interview report:", error);

        return null;
    }
}
module.exports = {
    invokeGeminiAI,
    generateInterviewReport
};