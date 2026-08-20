const Job = require("../models/Job");

const {
    parseJobSearchQuery
} = require("../services/aiJobSearchService");

const {
    searchJobs
} = require("../services/jobSearchService");

const {
    rankJobsWithAI
} = require("../services/jobAIService");


// AI Job Search
const aiSearchJobs = async (req, res) => {
    try {
        const {
            query = ""
        } = req.body;

        // Validate user query
        if (!query.trim()) {
            return res.status(400).json({
                message:
                    "Please describe the type of job you are looking for."
            });
        }


        // --------------------------------
        // STEP 1
        // Understand user request using AI
        // --------------------------------

        const searchCriteria =
            await parseJobSearchQuery(
                query
            );


        // --------------------------------
        // STEP 2
        // Search real jobs
        // using existing job search service
        // --------------------------------

        const searchResult =
            await searchJobs({
                role:
                    searchCriteria.role,

                location:
                    searchCriteria.location,

                page: 1,

                limit: 15,

                jobType:
                    searchCriteria.jobType,

                category:
                    searchCriteria.category,

                remoteOnly:
                    searchCriteria.remoteOnly
            });


        let jobs =
            searchResult.jobs || [];


        // --------------------------------
        // STEP 3
        // AI ranking
        // --------------------------------

        if (jobs.length > 0) {

            jobs =
                await rankJobsWithAI({
                    role:
                        searchCriteria.role,

                    location:
                        searchCriteria.location,

                    jobs
                });

        }


        // --------------------------------
        // STEP 4
        // Check which jobs are already
        // saved by current user
        // --------------------------------

        const urls =
            jobs
                .map(
                    (job) =>
                        job.jobUrl
                )
                .filter(Boolean);


        const savedJobs =
            urls.length > 0
                ? await Job.find({
                      user: req.userId,

                      jobUrl: {
                          $in: urls
                      }
                  }).select(
                      "jobUrl status"
                  )
                : [];


        const savedMap =
            new Map(
                savedJobs.map(
                    (job) => [
                        job.jobUrl,

                        {
                            trackerId:
                                job._id,

                            status:
                                job.status
                        }
                    ]
                )
            );


        // --------------------------------
        // STEP 5
        // Attach tracker information
        // --------------------------------

        jobs =
            jobs.map((job) => {

                const saved =
                    savedMap.get(
                        job.jobUrl
                    );


                return {
                    ...job,

                    saved:
                        Boolean(saved),

                    trackerId:
                        saved?.trackerId ||
                        null,

                    trackerStatus:
                        saved?.status ||
                        null
                };

            });


        // --------------------------------
        // RESPONSE
        // --------------------------------

        return res.status(200).json({

            message:
                "AI job search completed successfully.",

            query,

            searchCriteria,

            total:
                jobs.length,

            jobs

        });

    } catch (error) {

        console.error(
            "AI Job Search Controller Error:",
            error
        );


        return res.status(500).json({

            message:
                error.message ||
                "AI job search failed."

        });

    }
};


module.exports = {
    aiSearchJobs
};