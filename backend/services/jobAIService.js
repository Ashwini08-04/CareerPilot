const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const rankJobsWithAI = async ({
    role = "",
    location = "",
    jobs = []
}) => {
    if (!jobs.length) {
        return [];
    }

    try {
        const jobData = jobs.map((job, index) => ({
            index,
            title: job.jobTitle,
            company: job.company,
            location: job.location,
            category: job.category,
            jobType: job.jobType,
            description: job.description
        }));

        const response =
            await ai.models.generateContent({
                model: "gemini-3.5-flash",

                contents: `
You are CareerPilot AI, an intelligent job
matching assistant.

The user is searching for:

Role:
${role || "Any software development role"}

Location:
${location || "Any location"}

Analyze every job and calculate how relevant
it is to the user's search.

Return ONLY valid JSON.

Return exactly:

{
    "jobs": [
        {
            "index": 0,
            "matchScore": 0,
            "reason": ""
        }
    ]
}

Rules:

- Return one result for EVERY job.
- index must exactly match the provided job index.
- matchScore must be an integer from 0 to 100.
- 90-100 means excellent match.
- 75-89 means good match.
- 50-74 means moderate match.
- Below 50 means weak match.
- Consider job title.
- Consider job category.
- Consider job description.
- Consider location.
- Consider job type.
- Do not invent information.
- Keep reason short and useful.
- Use valid JSON.
- Use double quotes.
- Do not use markdown.
- Do not use code fences.
- Do not add explanation outside JSON.

Jobs:

${JSON.stringify(jobData)}
`
            });

        const text =
            typeof response.text === "function"
                ? response.text()
                : response.text;

        if (!text) {
            return jobs;
        }

        let cleanedText = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const start =
            cleanedText.indexOf("{");

        const end =
            cleanedText.lastIndexOf("}");

        if (
            start === -1 ||
            end === -1
        ) {
            return jobs;
        }

        cleanedText =
            cleanedText.substring(
                start,
                end + 1
            );

        const result =
            JSON.parse(cleanedText);

        if (
            !result.jobs ||
            !Array.isArray(result.jobs)
        ) {
            return jobs;
        }

        const aiMap = new Map();

        result.jobs.forEach((item) => {
            const score = Math.min(
                Math.max(
                    Number(item.matchScore) || 0,
                    0
                ),
                100
            );

            aiMap.set(
                Number(item.index),
                {
                    matchScore: score,

                    reason:
                        typeof item.reason ===
                        "string"
                            ? item.reason
                            : "AI match analysis unavailable."
                }
            );
        });

        const rankedJobs = jobs.map(
            (job, index) => {
                const aiResult =
                    aiMap.get(index);

                return {
                    ...job,

                    aiMatchScore:
                        aiResult?.matchScore || 0,

                    aiReason:
                        aiResult?.reason ||
                        "AI match analysis unavailable."
                };
            }
        );

        // Highest AI match first
        rankedJobs.sort(
            (a, b) =>
                b.aiMatchScore -
                a.aiMatchScore
        );

        return rankedJobs;

    } catch (error) {
        console.error(
            "AI Job Matching Error:",
            error.message
        );

        // AI failure should not break job search
        return jobs.map((job) => ({
            ...job,
            aiMatchScore: 0,
            aiReason:
                "AI matching temporarily unavailable."
        }));
    }
};

module.exports = {
    rankJobsWithAI
};