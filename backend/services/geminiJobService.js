const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const parseJobSearchQuery = async (query) => {
    if (!query || !query.trim()) {
        throw new Error("Job search query is required.");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `
You are CareerPilot AI, an intelligent job search assistant.

Understand the user's job search request and convert it into structured search criteria.

User request:
"${query}"

Return ONLY valid JSON.

Return exactly this structure:

{
    "role": "",
    "location": "",
    "category": "",
    "jobType": "",
    "experience": "",
    "skills": [],
    "remoteOnly": false
}

Rules:

1. Extract the main job role.

2. Extract location if mentioned.

3. If the user says remote, work from home, WFH, or remote job,
set remoteOnly to true.

4. Identify the most relevant category.

Allowed categories:

Software Development
Frontend Development
Backend Development
Full Stack Development
Data Science
Data Analytics
Machine Learning
Artificial Intelligence
DevOps
Cloud Computing
Cyber Security
UI/UX Design
Product Management
QA / Testing
Business Analyst
Marketing
Sales
Writing
Information Technology
Other

5. Identify job type if mentioned.

Allowed job types:

full_time
part_time
contract
freelance

6. Identify experience level.

Examples:

fresher
internship
entry level
junior
mid level
senior

7. Extract important technical skills.

Examples:

React
JavaScript
TypeScript
Node.js
Express
MongoDB
Python
Java
SQL
AWS
Docker

8. Do not invent information.

9. If information is not mentioned, return an empty string.

10. skills must always be an array.

11. remoteOnly must always be true or false.

12. Return JSON only.

13. Do not use markdown.

14. Do not use code fences.

Example:

User:
"Find me fresher React developer jobs in Bangalore"

Output:

{
    "role": "React Developer",
    "location": "Bangalore",
    "category": "Frontend Development",
    "jobType": "",
    "experience": "fresher",
    "skills": [
        "React",
        "JavaScript"
    ],
    "remoteOnly": false
}
`
        });

        const text =
            typeof response.text === "function"
                ? response.text()
                : response.text;

        if (!text) {
            throw new Error(
                "Gemini returned an empty response."
            );
        }

        let cleanedText = String(text)
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const start =
            cleanedText.indexOf("{");

        const end =
            cleanedText.lastIndexOf("}");

        if (start === -1 || end === -1) {
            console.error(
                "Invalid Gemini response:",
                cleanedText
            );

            throw new Error(
                "AI returned invalid search criteria."
            );
        }

        cleanedText =
            cleanedText.substring(
                start,
                end + 1
            );

        const result =
            JSON.parse(cleanedText);

        const searchCriteria = {
            role:
                typeof result.role === "string"
                    ? result.role.trim()
                    : "",

            location:
                typeof result.location === "string"
                    ? result.location.trim()
                    : "",

            category:
                typeof result.category === "string"
                    ? result.category.trim()
                    : "",

            jobType:
                typeof result.jobType === "string"
                    ? result.jobType.trim()
                    : "",

            experience:
                typeof result.experience === "string"
                    ? result.experience.trim()
                    : "",

            skills:
                Array.isArray(result.skills)
                    ? result.skills
                        .filter(
                            (skill) =>
                                typeof skill === "string"
                        )
                        .map((skill) =>
                            skill.trim()
                        )
                        .filter(Boolean)
                    : [],

            remoteOnly:
                result.remoteOnly === true
        };

        console.log(
            "AI Search Criteria:",
            searchCriteria
        );

        return searchCriteria;

    } catch (error) {
        console.error(
            "AI Job Query Parsing Error:",
            error
        );

        throw new Error(
            error.message ||
            "Unable to understand your job search."
        );
    }
};

module.exports = {
    parseJobSearchQuery
};