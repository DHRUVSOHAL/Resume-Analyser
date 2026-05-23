const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number(),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    behaviouralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),

    preparationPlans: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    ),
    title:z.string().describe("The title of the job for which the interview report is generated")
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
"title": string,
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

Generate:
- 5 technical questions
- 3 behavioural questions
- 3 skill gaps
- 5 preparation plan days

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.3
            }
        });

        const rawText = response.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const jsonData = JSON.parse(rawText);

        const parsedData = interviewReportSchema.parse(jsonData);

        return parsedData;

    } catch (error) {

        console.error("AI ERROR:", error);

        return null;
    }
}

module.exports = {
    generateInterviewReport
};