const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const searchCriteriaSchema = {
    type: "object",
    properties: {
        role: {
            type: "string"
        },
        location: {
            type: "string"
        },
        category: {
            type: "string"
        },
        jobType: {
            type: "string"
        },
        experience: {
            type: "string"
        },
        skills: {
            type: "array",
            items: {
                type: "string"
            }
        },
        remoteOnly: {
            type: "boolean"
        }
    },
    required: [
        "role",
        "location",
        "category",
        "jobType",
        "experience",
        "skills",
        "remoteOnly"
    ]
};

const parseJobSearchQuery = async (query) => {
    if (!query || !query.trim()) {
        throw new Error(
            "Job search query is required."
        );
    }

    try {
        const response =
            await ai.models.generateContent({
                model: "gemini-2.5-flash",

                contents: `
You are CareerPilot AI, an intelligent job
search query understanding system.

Convert the user's natural-language job search
request into structured search criteria.

USER REQUEST:
"${query}"

IMPORTANT RULES:

1. Extract the main job role.

2. Extract the location if mentioned.

3. If the user says:
   - remote
   - work from home
   - WFH
   - remote jobs

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

5. Identify job type if explicitly mentioned.

Allowed job types:

full_time
part_time
contract
freelance

6. Identify experience level.

Examples:

fresher
entry level
junior
mid level
senior
internship

7. Extract important skills.

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

8. Do not invent skills.

9. Do not invent location.

10. Do not invent experience.

11. If information is not present,
return an empty string.

12. skills must always be an array.

13. remoteOnly must always be boolean.

14. Normalize common variations.

Examples:

"React JS" → "React"
"React.js" → "React"
"Node JS" → "Node.js"
"NodeJS" → "Node.js"
"JS" → "JavaScript"

15. If user says "React jobs",
role should be:

"React Developer"

16. If user says "frontend React developer",
role should be:

"React Developer"

and category should be:

"Frontend Development"

17. If user says:

"fresher React developer jobs in Bangalore"

extract:

role → React Developer
location → Bangalore
category → Frontend Development
experience → fresher
skills → React, JavaScript

18. If user says:

"senior backend Node.js developer remote"

extract:

role → Backend Developer
category → Backend Development
experience → senior
skills → Node.js
remoteOnly → true

Return only the structured information.
`,

                config: {
                    responseMimeType:
                        "application/json",

                    responseSchema:
                        searchCriteriaSchema
                }
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

        let result;

        try {
            result = JSON.parse(text);
        } catch (error) {
            console.error(
                "Gemini JSON Parse Error:",
                error
            );

            console.error(
                "Gemini Response:",
                text
            );

            throw new Error(
                "AI returned invalid search criteria."
            );
        }

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
                                  typeof skill ===
                                  "string"
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
            "========== AI SEARCH CRITERIA =========="
        );

        console.log(
            JSON.stringify(
                searchCriteria,
                null,
                2
            )
        );

        return searchCriteria;

    } catch (error) {
        console.error(
            "AI Job Query Parsing Error:",
            error.message
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