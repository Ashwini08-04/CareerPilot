// Gemini setup
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// Parse Gemini response safely
const parseAIResponse = (response) => {
    try {
        const text =
            typeof response.text === "function"
                ? response.text()
                : response.text;

        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        console.log("========== GEMINI RAW RESPONSE ==========");
        console.log(text);
        console.log("=========================================");

        let cleanedText = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Find JSON object
        const start = cleanedText.indexOf("{");
        const end = cleanedText.lastIndexOf("}");

        if (start === -1 || end === -1) {
            throw new Error("No JSON object found in AI response");
        }

        cleanedText = cleanedText.substring(start, end + 1);

        const parsed = JSON.parse(cleanedText);

        console.log("========== PARSED AI RESULT =============");
        console.log(parsed);
        console.log("=========================================");

        return parsed;

    } catch (error) {
        console.error("AI JSON Parse Error:", error);

        throw new Error(
            "AI returned an invalid response. Please try again."
        );
    }
};


// Analyze resume
const analyzeResume = async (resumeText) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",

            contents: `
Analyze this resume as a professional career and recruitment assistant.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not add any explanation outside JSON.

Return exactly:

{
    "score": 0,
    "summary": "",
    "skills": [],
    "strengths": [],
    "weaknesses": [],
    "suggestions": []
}

Rules:

- score must be an integer between 0 and 100.
- Evaluate technical skills, projects, experience, education,
  ATS readiness, clarity and relevance for software development.
- summary must be a short professional overview.
- skills must contain skills actually found in the resume.
- strengths must contain 3 to 5 specific strengths.
- weaknesses must contain 3 to 5 realistic areas for improvement.
- suggestions must contain 3 to 5 actionable recommendations.
- Do not invent skills or experience.
- Use valid JSON.
- Use double quotes for all strings.
- Do not use trailing commas.

Resume:

${resumeText}
`
        });

        const analysis = parseAIResponse(response);

        return {
            score: Number(analysis.score) || 0,

            summary:
                typeof analysis.summary === "string"
                    ? analysis.summary
                    : "",

            skills:
                Array.isArray(analysis.skills)
                    ? analysis.skills
                    : [],

            strengths:
                Array.isArray(analysis.strengths)
                    ? analysis.strengths
                    : [],

            weaknesses:
                Array.isArray(analysis.weaknesses)
                    ? analysis.weaknesses
                    : [],

            suggestions:
                Array.isArray(analysis.suggestions)
                    ? analysis.suggestions
                    : []
        };

    } catch (error) {
        console.error("Resume AI Analysis Error:", error);
        throw error;
    }
};


// Match resume with job description
const matchResumeWithJob = async (
    resumeText,
    jobDescription
) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",

            contents: `
Compare the resume with the job description.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

Return exactly:

{
    "matchPercentage": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "recommendations": []
}

Rules:

- matchPercentage must be an integer from 0 to 100.
- matchedSkills must contain skills present in both.
- missingSkills must contain relevant missing skills.
- recommendations must contain 3 to 5 actionable recommendations.
- Do not invent information.
- Use valid JSON.
- Use double quotes for all strings.
- Do not use trailing commas.

Resume:

${resumeText}

Job Description:

${jobDescription}
`
        });

        const result = parseAIResponse(response);

        return {
            matchPercentage:
                Number(result.matchPercentage) || 0,

            matchedSkills:
                Array.isArray(result.matchedSkills)
                    ? result.matchedSkills
                    : [],

            missingSkills:
                Array.isArray(result.missingSkills)
                    ? result.missingSkills
                    : [],

            recommendations:
                Array.isArray(result.recommendations)
                    ? result.recommendations
                    : []
        };

    } catch (error) {
        console.error("Job Match AI Error:", error);
        throw error;
    }
};


// Generate interview questions
const generateInterviewQuestions = async (
    jobDescription
) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",

            contents: `
Generate interview preparation questions based on this job description.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

Return exactly:

{
    "questions": [
        {
            "question": "",
            "modelAnswer": "",
            "category": ""
        }
    ]
}

Rules:

- Generate exactly 10 questions.
- Include Technical questions.
- Include Behavioral questions.
- Include Role-specific questions.
- Each question must have a practical interview-ready model answer.
- category must be:
  "Technical"
  "Behavioral"
  or
  "Role-specific"
- Use valid JSON.
- Use double quotes for all strings.
- Do not use trailing commas.

Job Description:

${jobDescription}
`
        });

        const result = parseAIResponse(response);

        return {
            questions:
                Array.isArray(result.questions)
                    ? result.questions
                    : []
        };

    } catch (error) {
        console.error("Interview AI Error:", error);
        throw error;
    }
};

// Evaluate interview answer
const evaluateInterviewAnswer = async (question, answer) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `
You are an interview evaluator.

Evaluate the candidate's answer to the interview question.

Return ONLY this JSON object:

{
    "score": 0,
    "feedback": "",
    "improvement": ""
}

Rules:
- score must be an integer from 0 to 10.
- feedback must briefly explain what was good or missing.
- improvement must give practical advice to improve the answer.
- Do not return markdown.
- Do not return code fences.
- Do not add any text outside JSON.
- Use double quotes for all strings.
- Do not use trailing commas.

Interview Question:
${question}

Candidate Answer:
${answer}
`
        });

        const result = parseAIResponse(response);

        return {
            score: Math.min(Math.max(Number(result.score) || 0, 0), 10),
            feedback:
                typeof result.feedback === "string"
                    ? result.feedback
                    : "",
            improvement:
                typeof result.improvement === "string"
                    ? result.improvement
                    : ""
        };
    } catch (error) {
        console.error("Interview Evaluation AI Error:", error);
        throw error;
    }
};
// Generate career assistant response
const careerAssistant = async (question, careerData = {}) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",

            contents: `
You are CareerPilot AI, a professional career assistant.

Answer the user's career question using the available career data.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

Return exactly:

{
    "answer": "",
    "suggestions": []
}

Rules:

- answer must be clear, practical and concise.
- suggestions must contain 2 to 4 useful next steps.
- Use the user's career data when available.
- Do not invent experience, skills or qualifications.
- If information is missing, clearly say what information would help.
- Focus on software development, job search, resume, skills,
  interviews and career growth.
- Use valid JSON.
- Use double quotes for all strings.
- Do not use trailing commas.

Career Data:

${JSON.stringify(careerData)}

User Question:

${question}
`
        });

        const result = parseAIResponse(response);

        return {
            answer:
                typeof result.answer === "string"
                    ? result.answer
                    : "",

            suggestions:
                Array.isArray(result.suggestions)
                    ? result.suggestions
                    : []
        };

    } catch (error) {
        console.error("Career Assistant AI Error:", error);
        throw error;
    }
};
// Analyze job match for CareerPilot job search
const matchJobForUser = async (userSkills, job) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",

            contents: `
You are CareerPilot AI, a professional job matching assistant.

Compare the candidate skills with this job.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not add any explanation outside JSON.

Return exactly:

{
    "matchPercentage": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "recommendation": ""
}

Rules:

- matchPercentage must be an integer from 0 to 100.
- matchedSkills must contain relevant skills the candidate has.
- missingSkills must contain important skills required by the job but missing from the candidate.
- recommendation must be short and practical.
- Do not invent candidate skills.
- Use valid JSON.
- Use double quotes for all strings.
- Do not use trailing commas.

Candidate Skills:

${JSON.stringify(userSkills)}

Job Title:

${job.jobTitle || ""}

Job Category:

${job.category || ""}

Job Type:

${job.jobType || ""}

Job Location:

${job.location || ""}

Job Description:

${job.description || ""}
`
        });

        const result = parseAIResponse(response);

        return {
            matchPercentage: Math.min(
                Math.max(
                    Number(result.matchPercentage) || 0,
                    0
                ),
                100
            ),

            matchedSkills:
                Array.isArray(result.matchedSkills)
                    ? result.matchedSkills
                    : [],

            missingSkills:
                Array.isArray(result.missingSkills)
                    ? result.missingSkills
                    : [],

            recommendation:
                typeof result.recommendation === "string"
                    ? result.recommendation
                    : ""
        };

    } catch (error) {
        console.error("Job Search AI Match Error:", error);
        throw error;
    }
};


module.exports = {
    analyzeResume,
    matchResumeWithJob,
    matchJobForUser,
    generateInterviewQuestions,
    careerAssistant,
    evaluateInterviewAnswer
};