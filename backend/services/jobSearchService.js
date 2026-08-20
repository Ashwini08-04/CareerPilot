const REMOTIVE_API = "https://remotive.com/api/remote-jobs";

// Normalize text
const normalize = (value = "") =>
    String(value)
        .toLowerCase()
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/[^a-z0-9+#./\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

// Normalize skill/keyword
const normalizeKeyword = (value = "") =>
    normalize(value)
        .replace(/[.#/+-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

// Check if text contains keyword
const containsKeyword = (text, keyword) => {
    const normalizedText = normalizeKeyword(text);
    const normalizedKeyword = normalizeKeyword(keyword);

    if (!normalizedKeyword) {
        return false;
    }

    return normalizedText.includes(normalizedKeyword);
};

// Role rules
const ROLE_RULES = {
    "react developer": {
        title: [
            "react developer",
            "react engineer",
            "reactjs developer",
            "frontend developer",
            "front end developer",
            "frontend engineer",
            "front end engineer",
            "web developer"
        ],

        keywords: [
            "react",
            "react.js",
            "reactjs",
            "javascript",
            "typescript",
            "frontend",
            "front end",
            "next.js",
            "nextjs"
        ],

        category: [
            "frontend",
            "software development",
            "web development"
        ]
    },

    react: {
        title: [
            "react developer",
            "react engineer",
            "reactjs developer",
            "frontend developer",
            "frontend engineer"
        ],

        keywords: [
            "react",
            "react.js",
            "reactjs",
            "javascript",
            "typescript"
        ],

        category: [
            "frontend",
            "software development"
        ]
    },

    "frontend developer": {
        title: [
            "frontend developer",
            "front end developer",
            "frontend engineer",
            "front end engineer",
            "react developer",
            "web developer"
        ],

        keywords: [
            "frontend",
            "front end",
            "react",
            "javascript",
            "typescript",
            "vue",
            "angular",
            "next.js",
            "nextjs"
        ],

        category: [
            "frontend",
            "web development",
            "software development"
        ]
    },

    frontend: {
        title: [
            "frontend developer",
            "front end developer",
            "frontend engineer",
            "react developer"
        ],

        keywords: [
            "frontend",
            "front end",
            "react",
            "javascript",
            "typescript",
            "vue",
            "angular"
        ],

        category: [
            "frontend",
            "web development"
        ]
    },

    "backend developer": {
        title: [
            "backend developer",
            "back end developer",
            "backend engineer",
            "back end engineer",
            "node developer",
            "python developer",
            "java developer"
        ],

        keywords: [
            "backend",
            "back end",
            "node",
            "node.js",
            "python",
            "java",
            "express",
            "django",
            "spring",
            "api",
            "server"
        ],

        category: [
            "backend",
            "software development"
        ]
    },

    backend: {
        title: [
            "backend developer",
            "back end developer",
            "backend engineer",
            "node developer",
            "python developer",
            "java developer"
        ],

        keywords: [
            "backend",
            "back end",
            "node",
            "node.js",
            "python",
            "java",
            "api",
            "server"
        ],

        category: [
            "backend",
            "software development"
        ]
    },

    "full stack developer": {
        title: [
            "full stack developer",
            "fullstack developer",
            "full stack engineer",
            "software engineer"
        ],

        keywords: [
            "full stack",
            "fullstack",
            "react",
            "node",
            "javascript",
            "typescript",
            "mern",
            "mean"
        ],

        category: [
            "software development",
            "web development"
        ]
    },

    "full stack": {
        title: [
            "full stack developer",
            "fullstack developer",
            "full stack engineer"
        ],

        keywords: [
            "full stack",
            "fullstack",
            "react",
            "node",
            "javascript",
            "mern"
        ],

        category: [
            "software development"
        ]
    },

    "software developer": {
        title: [
            "software developer",
            "software engineer",
            "application developer",
            "web developer"
        ],

        keywords: [
            "software development",
            "programming",
            "developer",
            "javascript",
            "python",
            "java",
            "node",
            "react"
        ],

        category: [
            "software development",
            "engineering"
        ]
    },

    "data analyst": {
        title: [
            "data analyst",
            "data analytics",
            "business data analyst"
        ],

        keywords: [
            "data analyst",
            "data analytics",
            "sql",
            "excel",
            "power bi",
            "tableau",
            "python"
        ],

        category: [
            "data",
            "analytics"
        ]
    },

    "data scientist": {
        title: [
            "data scientist",
            "data science",
            "machine learning engineer"
        ],

        keywords: [
            "data science",
            "machine learning",
            "python",
            "sql",
            "pandas",
            "numpy",
            "tensorflow",
            "pytorch"
        ],

        category: [
            "data science",
            "machine learning"
        ]
    },

    "devops engineer": {
        title: [
            "devops engineer",
            "devops developer",
            "cloud engineer",
            "site reliability engineer"
        ],

        keywords: [
            "devops",
            "docker",
            "kubernetes",
            "aws",
            "azure",
            "gcp",
            "jenkins",
            "ci cd",
            "terraform"
        ],

        category: [
            "devops",
            "cloud"
        ]
    }
};

// Convert Gemini role to known role
const normalizeRole = (role = "") => {
    const value = normalize(role);

    if (!value) {
        return "software developer";
    }

    if (
        value.includes("react") &&
        value.includes("developer")
    ) {
        return "react developer";
    }

    if (value === "react") {
        return "react";
    }

    if (
        value.includes("frontend") ||
        value.includes("front end")
    ) {
        return "frontend developer";
    }

    if (
        value.includes("backend") ||
        value.includes("back end")
    ) {
        return "backend developer";
    }

    if (
        value.includes("full stack") ||
        value.includes("fullstack")
    ) {
        return "full stack developer";
    }

    if (
        value.includes("data analyst") ||
        value.includes("data analytics")
    ) {
        return "data analyst";
    }

    if (
        value.includes("data scientist") ||
        value.includes("data science")
    ) {
        return "data scientist";
    }

    if (
        value.includes("devops")
    ) {
        return "devops engineer";
    }

    if (
        value.includes("software engineer") ||
        value.includes("software developer")
    ) {
        return "software developer";
    }

    return value;
};

// Generate search terms
const getSearchTerms = (
    role,
    skills = []
) => {
    const normalizedRole =
        normalizeRole(role);

    const rule =
        ROLE_RULES[normalizedRole];

    const terms = [];

    if (role) {
        terms.push(role);
    }

    if (rule) {
        terms.push(
            ...rule.title.slice(0, 4)
        );

        terms.push(
            ...rule.keywords.slice(0, 4)
        );
    }

    if (Array.isArray(skills)) {
        terms.push(
            ...skills.slice(0, 4)
        );
    }

    return [
        ...new Set(
            terms
                .map((term) =>
                    String(term).trim()
                )
                .filter(Boolean)
        )
    ].slice(0, 8);
};

// Extract searchable job text
const getJobText = (job) => {
    return {
        title: normalize(job.title),

        description:
            normalize(job.description),

        category:
            normalize(job.category),

        tags:
            normalize(
                Array.isArray(job.tags)
                    ? job.tags.join(" ")
                    : ""
            ),

        location:
            normalize(
                job.candidate_required_location
            )
    };
};

// Experience matching
const calculateExperienceScore = (
    job,
    experience = ""
) => {
    if (!experience) {
        return {
            score: 0,
            matched: false
        };
    }

    const text = normalize(
        `${job.title} ${job.description} ${job.category}`
    );

    const level =
        normalize(experience);

    const fresherKeywords = [
        "fresher",
        "fresh graduate",
        "recent graduate",
        "entry level",
        "entry-level",
        "junior",
        "intern",
        "internship",
        "0 years",
        "0-1 years",
        "0 to 1 years",
        "graduate"
    ];

    const juniorKeywords = [
        "junior",
        "entry level",
        "entry-level",
        "associate",
        "0-2 years",
        "1-2 years",
        "1 year"
    ];

    const midKeywords = [
        "mid level",
        "mid-level",
        "2-5 years",
        "3-5 years",
        "2+ years",
        "3+ years"
    ];

    const seniorKeywords = [
        "senior",
        "lead",
        "principal",
        "staff",
        "manager",
        "5+ years",
        "7+ years",
        "8+ years"
    ];

    let keywords = [];

    if (
        level.includes("fresher") ||
        level.includes("intern") ||
        level.includes("entry")
    ) {
        keywords =
            fresherKeywords;
    } else if (
        level.includes("junior")
    ) {
        keywords =
            juniorKeywords;
    } else if (
        level.includes("mid")
    ) {
        keywords =
            midKeywords;
    } else if (
        level.includes("senior")
    ) {
        keywords =
            seniorKeywords;
    }

    const matched =
        keywords.some(
            (keyword) =>
                containsKeyword(
                    text,
                    keyword
                )
        );

    // Explicit senior job should not rank highly
    // for fresher searches.
    const seniorJob =
        seniorKeywords.some(
            (keyword) =>
                containsKeyword(
                    text,
                    keyword
                )
        );

    if (
        level.includes("fresher") &&
        seniorJob &&
        !matched
    ) {
        return {
            score: -30,
            matched: false,
            seniorJob: true
        };
    }

    return {
        score: matched ? 20 : 0,
        matched,
        seniorJob
    };
};

// Calculate relevance
const calculateRelevance = (
    job,
    role,
    skills = [],
    experience = "",
    category = ""
) => {
    const normalizedRole =
        normalizeRole(role);

    const rule =
        ROLE_RULES[normalizedRole];

    const {
        title,
        description,
        category: jobCategory,
        tags
    } = getJobText(job);

    const allText = [
        title,
        description,
        jobCategory,
        tags
    ].join(" ");

    let score = 0;

    const matchedKeywords = [];

    let titleMatched = false;

    // --------------------------------
    // Role matching
    // --------------------------------

    if (rule) {
        rule.title.forEach(
            (keyword) => {
                if (
                    containsKeyword(
                        title,
                        keyword
                    )
                ) {
                    score += 35;

                    titleMatched = true;

                    if (
                        !matchedKeywords.includes(
                            keyword
                        )
                    ) {
                        matchedKeywords.push(
                            keyword
                        );
                    }
                }
            }
        );

        rule.keywords.forEach(
            (keyword) => {
                if (
                    containsKeyword(
                        allText,
                        keyword
                    )
                ) {
                    score += 8;

                    if (
                        !matchedKeywords.includes(
                            keyword
                        )
                    ) {
                        matchedKeywords.push(
                            keyword
                        );
                    }
                }
            }
        );

        rule.category.forEach(
            (keyword) => {
                if (
                    containsKeyword(
                        jobCategory,
                        keyword
                    )
                ) {
                    score += 8;
                }
            }
        );
    } else {
        if (
            containsKeyword(
                title,
                role
            )
        ) {
            score += 40;

            titleMatched = true;
        }

        if (
            containsKeyword(
                allText,
                role
            )
        ) {
            score += 15;
        }
    }

    // --------------------------------
    // Gemini skills
    // --------------------------------

    const matchedSkills = [];

    if (Array.isArray(skills)) {
        skills.forEach(
            (skill) => {
                if (
                    containsKeyword(
                        allText,
                        skill
                    )
                ) {
                    score += 8;

                    matchedSkills.push(
                        skill
                    );
                }
            }
        );
    }

    // --------------------------------
    // Category
    // --------------------------------

    if (category) {
        if (
            containsKeyword(
                jobCategory,
                category
            ) ||
            containsKeyword(
                allText,
                category
            )
        ) {
            score += 12;
        }
    }

    // --------------------------------
    // Experience
    // --------------------------------

    const experienceResult =
        calculateExperienceScore(
            job,
            experience
        );

    score +=
        experienceResult.score;

    // --------------------------------
    // Normalize
    // --------------------------------

    score = Math.max(
        0,
        Math.min(
            score,
            100
        )
    );

    /*
     * A job is considered relevant when:
     *
     * 1. Role appears in title
     * OR
     * 2. Multiple relevant keywords match
     * OR
     * 3. Gemini skills match strongly
     */

    const keywordMatches =
        matchedKeywords.length;

    const relevant =
        titleMatched ||
        keywordMatches >= 2 ||
        matchedSkills.length >= 1;

    let reason =
        "Relevant opportunity";

    if (
        matchedSkills.length > 0
    ) {
        reason =
            `Matched skills: ${matchedSkills
                .slice(0, 4)
                .join(", ")}`;
    } else if (
        matchedKeywords.length > 0
    ) {
        reason =
            `Matched: ${matchedKeywords
                .slice(0, 4)
                .join(", ")}`;
    }

    if (
        experienceResult.matched
    ) {
        reason +=
            " • Experience level matched";
    }

    return {
        score,
        relevant,
        reason,
        matchedSkills,
        matchedKeywords,
        experienceMatched:
            experienceResult.matched
    };
};

// Location matching
const matchesLocation = (
    jobLocation = "",
    requestedLocation = ""
) => {
    if (!requestedLocation) {
        return true;
    }

    const location =
        normalize(jobLocation);

    const requested =
        normalize(requestedLocation);

    const remoteKeywords = [
        "remote",
        "worldwide",
        "anywhere",
        "global",
        "work from home"
    ];

    if (
        remoteKeywords.some(
            (keyword) =>
                location.includes(keyword)
        )
    ) {
        return true;
    }

    const aliases = {
        bangalore: [
            "bangalore",
            "bengaluru",
            "india"
        ],

        bengaluru: [
            "bangalore",
            "bengaluru",
            "india"
        ],

        pune: [
            "pune",
            "india"
        ],

        mumbai: [
            "mumbai",
            "bombay",
            "india"
        ],

        hyderabad: [
            "hyderabad",
            "india"
        ],

        chennai: [
            "chennai",
            "india"
        ],

        delhi: [
            "delhi",
            "new delhi",
            "india"
        ],

        nagpur: [
            "nagpur",
            "india"
        ],

        nashik: [
            "nashik",
            "nasik",
            "india"
        ],

        kolkata: [
            "kolkata",
            "calcutta",
            "india"
        ],

        india: [
            "india"
        ]
    };

    const accepted =
        aliases[requested] || [
            requested
        ];

    return accepted.some(
        (item) =>
            location.includes(item)
    );
};

// Remote detection
const isRemoteJob = (job) => {
    const location =
        normalize(
            job.candidate_required_location
        );

    const description =
        normalize(
            job.description
        );

    return [
        "remote",
        "worldwide",
        "anywhere",
        "global",
        "work from home"
    ].some(
        (keyword) =>
            location.includes(
                keyword
            ) ||
            description.includes(
                keyword
            )
    );
};

// Fetch Remotive jobs
const fetchJobs = async (
    term
) => {
    try {
        const response =
            await fetch(
                `${REMOTIVE_API}?search=${encodeURIComponent(
                    term
                )}`
            );

        if (!response.ok) {
            console.error(
                `Remotive error for "${term}":`,
                response.status
            );

            return [];
        }

        const data =
            await response.json();

        return Array.isArray(
            data.jobs
        )
            ? data.jobs
            : [];
    } catch (error) {
        console.error(
            `Remotive search failed: ${term}`,
            error.message
        );

        return [];
    }
};

// Main search
const searchJobs = async ({
    query = "",
    role = "",
    location = "",
    page = 1,
    limit = 15,
    jobType = "",
    category = "",
    remoteOnly = false,
    experience = "",
    skills = []
}) => {
    try {
        const pageNumber =
            Math.max(
                Number(page) || 1,
                1
            );

        const pageLimit =
            Math.min(
                Number(limit) || 15,
                15
            );

        const searchRole =
            role.trim() ||
            "software developer";

        const searchLocation =
            location.trim();

        const normalizedRole =
            normalizeRole(
                searchRole
            );

        const terms =
            getSearchTerms(
                normalizedRole,
                skills
            );

        console.log(
            "\n========== JOB SEARCH =========="
        );

        console.log(
            "Query:",
            query
        );

        console.log(
            "Role:",
            normalizedRole
        );

        console.log(
            "Location:",
            searchLocation
        );

        console.log(
            "Experience:",
            experience
        );

        console.log(
            "Skills:",
            skills
        );

        console.log(
            "Category:",
            category
        );

        console.log(
            "Terms:",
            terms
        );

        // Fetch all terms
        const responses =
            await Promise.all(
                terms.map(
                    (term) =>
                        fetchJobs(term)
                )
            );

        const allJobs =
            responses.flat();

        console.log(
            "Jobs received:",
            allJobs.length
        );

        // Remove duplicate jobs
        const seen =
            new Set();

        const uniqueJobs =
            allJobs.filter(
                (job) => {
                    const key =
                        job.id ||
                        job.url ||
                        `${job.company_name}-${job.title}`;

                    if (
                        seen.has(key)
                    ) {
                        return false;
                    }

                    seen.add(key);

                    return true;
                }
            );

        // Calculate relevance
        let scoredJobs =
            uniqueJobs.map(
                (job) => ({
                    job,
                    relevance:
                        calculateRelevance(
                            job,
                            normalizedRole,
                            skills,
                            experience,
                            category
                        )
                })
            );

        // Remove unrelated jobs
        scoredJobs =
            scoredJobs.filter(
                (item) =>
                    item.relevance.relevant
            );

        console.log(
            "After relevance filter:",
            scoredJobs.length
        );

        // Location filter
        if (searchLocation) {
            scoredJobs =
                scoredJobs.filter(
                    (item) =>
                        matchesLocation(
                            item.job
                                .candidate_required_location,
                            searchLocation
                        )
                );
        }

        console.log(
            "After location filter:",
            scoredJobs.length
        );

        // Job type filter
        if (jobType.trim()) {
            scoredJobs =
                scoredJobs.filter(
                    (item) =>
                        normalize(
                            item.job.job_type
                        ) ===
                        normalize(
                            jobType
                        )
                );
        }

        // Category filter
        if (category.trim()) {
            scoredJobs =
                scoredJobs.filter(
                    (item) => {
                        const jobCategory =
                            normalize(
                                item.job.category
                            );

                        const requestedCategory =
                            normalize(
                                category
                            );

                        return (
                            jobCategory.includes(
                                requestedCategory
                            ) ||
                            requestedCategory.includes(
                                jobCategory
                            )
                        );
                    }
                );
        }

        // Remote filter
        if (
            remoteOnly === true ||
            remoteOnly === "true"
        ) {
            scoredJobs =
                scoredJobs.filter(
                    (item) =>
                        isRemoteJob(
                            item.job
                        )
                );
        }

        // --------------------------------
        // Sort
        // --------------------------------

        scoredJobs.sort(
            (a, b) => {
                if (
                    b.relevance.score !==
                    a.relevance.score
                ) {
                    return (
                        b.relevance.score -
                        a.relevance.score
                    );
                }

                return (
                    new Date(
                        b.job.publication_date ||
                            0
                    ) -
                    new Date(
                        a.job.publication_date ||
                            0
                    )
                );
            }
        );

        console.log(
            "Final relevant jobs:",
            scoredJobs.length
        );

        // Pagination
        const total =
            scoredJobs.length;

        const start =
            (pageNumber - 1) *
            pageLimit;

        const end =
            start + pageLimit;

        const selectedJobs =
            scoredJobs.slice(
                start,
                end
            );

        return {
            total,

            page:
                pageNumber,

            limit:
                pageLimit,

            hasMore:
                end < total,

            jobs:
                selectedJobs.map(
                    ({
                        job,
                        relevance
                    }) => ({
                        id:
                            job.id,

                        company:
                            job.company_name ||
                            "Unknown Company",

                        jobTitle:
                            job.title ||
                            "Untitled Job",

                        jobUrl:
                            job.url ||
                            "",

                        location:
                            job.candidate_required_location ||
                            "Worldwide",

                        salary:
                            job.salary ||
                            "",

                        jobType:
                            job.job_type ||
                            "",

                        category:
                            job.category ||
                            "",

                        description:
                            job.description ||
                            "",

                        publishedDate:
                            job.publication_date ||
                            "",

                        source:
                            "Remotive",

                        aiMatchScore:
                            relevance.score,

                        aiReason:
                            relevance.reason,

                        matchedSkills:
                            relevance.matchedSkills,

                        matchedKeywords:
                            relevance.matchedKeywords,

                        experienceMatched:
                            relevance.experienceMatched
                    })
                )
        };
    } catch (error) {
        console.error(
            "Job Search Service Error:",
            error
        );

        throw new Error(
            "Unable to search jobs"
        );
    }
};

module.exports = {
    searchJobs
};