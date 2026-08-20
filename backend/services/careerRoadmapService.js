const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateCareerRoadmap = async (targetRole, currentSkills) => {
    const prompt = `
You are an expert career mentor.

Create a practical career roadmap for:

Target Role: ${targetRole}

Current Skills:
${currentSkills.join(", ")}

Return ONLY valid JSON in this exact structure:

{
    "currentSkills": [],
    "missingSkills": [],
    "beginner": [],
    "intermediate": [],
    "advanced": [],
    "priorities": []
}

Rules:
- Keep currentSkills based only on the skills provided.
- Identify important missing skills for the target role.
- beginner, intermediate and advanced should contain practical skills or learning topics.
- priorities should contain the most important skills to learn first.
- Keep the roadmap realistic for a developer.
- Do not include markdown or code fences.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
};

module.exports = generateCareerRoadmap;