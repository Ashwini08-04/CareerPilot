const mongoose = require("mongoose");
const Job = require("../models/Job");
const { searchJobs } = require("../services/jobSearchService");
const { parseJobSearchQuery } = require("../services/geminiJobService");

// Create tracked job
const createJob = async (req, res) => {
    try {
        const {
            company,
            jobTitle,
            jobUrl,
            location,
            salary,
            jobType,
            category,
            description,
            status,
            appliedDate,
            notes
        } = req.body;

        if (!company || !jobTitle) {
            return res.status(400).json({
                message: "Company and job title are required"
            });
        }

        if (jobUrl) {
            const existingJob = await Job.findOne({
                user: req.userId,
                jobUrl
            });

            if (existingJob) {
                return res.status(409).json({
                    message: "Job already exists in your tracker",
                    job: existingJob
                });
            }
        }

        const job = await Job.create({
            company,
            jobTitle,
            jobUrl,
            location,
            salary,
            jobType,
            category,
            description,
            status: status || "Wishlist",
            appliedDate,
            notes,
            user: req.userId
        });

        return res.status(201).json({
            message: "Job saved successfully",
            job
        });
    } catch (error) {
        console.error("Create Job Error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Search external jobs using Gemini + Remotive
const searchExternalJobs = async (req, res) => {
    try {
        const {
            query = "",
            role = "",
            location = "",
            page = 1,
            limit = 15,
            jobType = "",
            category = "",
            remoteOnly = "false"
        } = req.query;

        if (!query.trim() && !role.trim()) {
            return res.status(400).json({
                message: "Please describe the job you are looking for."
            });
        }

        let aiCriteria = {
            role: role.trim(),
            location: location.trim(),
            category: category.trim(),
            jobType: jobType.trim(),
            experience: "",
            skills: [],
            remoteOnly:
                remoteOnly === true ||
                remoteOnly === "true"
        };

        // Use Gemini when user provides natural-language query
        if (query.trim()) {
            try {
                const parsedCriteria =
                    await parseJobSearchQuery(query.trim());

                aiCriteria = {
                    role:
                        parsedCriteria.role ||
                        aiCriteria.role,

                    location:
                        parsedCriteria.location ||
                        aiCriteria.location,

                    category:
                        parsedCriteria.category ||
                        aiCriteria.category,

                    jobType:
                        parsedCriteria.jobType ||
                        aiCriteria.jobType,

                    experience:
                        parsedCriteria.experience || "",

                    skills:
                        Array.isArray(
                            parsedCriteria.skills
                        )
                            ? parsedCriteria.skills
                            : [],

                    remoteOnly:
                        parsedCriteria.remoteOnly ||
                        aiCriteria.remoteOnly
                };
            } catch (aiError) {
                console.error(
                    "Gemini parsing failed:",
                    aiError.message
                );

                // Do not fail the complete search.
                // Search service can still understand the query.
            }
        }

        console.log("========== AI JOB SEARCH ==========");
        console.log("User Query:", query);
        console.log("AI Criteria:", aiCriteria);

        const result = await searchJobs({
            query,
            role: aiCriteria.role,
            location: aiCriteria.location,
            page: Number(page) || 1,
            limit: Number(limit) || 15,
            jobType: aiCriteria.jobType,
            category: aiCriteria.category,
            remoteOnly: aiCriteria.remoteOnly,
            experience: aiCriteria.experience,
            skills: aiCriteria.skills
        });

        const urls = result.jobs
            .map((job) => job.jobUrl)
            .filter(Boolean);

        let savedJobs = [];

        if (urls.length > 0) {
            savedJobs = await Job.find({
                user: req.userId,
                jobUrl: {
                    $in: urls
                }
            }).select(
                "_id jobUrl status"
            );
        }

        const savedMap = new Map(
            savedJobs.map((job) => [
                job.jobUrl,
                {
                    trackerId: job._id,
                    status: job.status
                }
            ])
        );

        const jobs = result.jobs.map((job) => {
            const savedData =
                savedMap.get(job.jobUrl);

            return {
                ...job,

                saved: Boolean(savedData),

                trackerId:
                    savedData?.trackerId ||
                    null,

                trackerStatus:
                    savedData?.status ||
                    null
            };
        });

        return res.status(200).json({
            success: true,

            query,

            criteria: {
                role: aiCriteria.role,
                location: aiCriteria.location,
                category: aiCriteria.category,
                jobType: aiCriteria.jobType,
                experience: aiCriteria.experience,
                skills: aiCriteria.skills,
                remoteOnly: aiCriteria.remoteOnly
            },

            total: result.total,

            page: result.page,

            limit: result.limit,

            hasMore: result.hasMore,

            jobs
        });
    } catch (error) {
        console.error(
            "External Job Search Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Job search failed",
            error: error.message
        });
    }
};

// Save external job
const saveJob = async (req, res) => {
    try {
        const {
            company,
            jobTitle,
            jobUrl,
            location,
            salary,
            jobType,
            category,
            description
        } = req.body;

        if (!company || !jobTitle) {
            return res.status(400).json({
                message: "Company and job title are required"
            });
        }

        if (jobUrl) {
            const existingJob = await Job.findOne({
                user: req.userId,
                jobUrl
            });

            if (existingJob) {
                return res.status(409).json({
                    message: "Job already exists in your tracker",
                    job: existingJob
                });
            }
        }

        const job = await Job.create({
            company,
            jobTitle,
            jobUrl,
            location,
            salary,
            jobType,
            category,
            description,
            status: "Wishlist",
            user: req.userId
        });

        return res.status(201).json({
            message: "Job saved successfully",
            job
        });
    } catch (error) {
        console.error("Save Job Error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get user jobs
const getJobs = async (req, res) => {
    try {
        const {
            search,
            status,
            location
        } = req.query;

        const page =
            Math.max(
                Number(req.query.page) || 1,
                1
            );

        const limit =
            Math.min(
                Number(req.query.limit) || 10,
                100
            );

        const skip =
            (page - 1) * limit;

        const filter = {
            user: req.userId
        };

        if (search) {
            filter.$or = [
                {
                    company: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    jobTitle: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (status) {
            filter.status = status;
        }

        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }

        const totalJobs =
            await Job.countDocuments(filter);

        const jobs =
            await Job.find(filter)
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit);

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalJobs,
            totalPages:
                Math.ceil(
                    totalJobs / limit
                ),
            jobs
        });
    } catch (error) {
        console.error(
            "Get Jobs Error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get single job
const getJob = async (req, res) => {
    try {
        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job =
            await Job.findOne({
                _id: req.params.id,
                user: req.userId
            });

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        return res.status(200).json({
            job
        });
    } catch (error) {
        console.error(
            "Get Job Error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Update job
const updateJob = async (req, res) => {
    try {
        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const allowedFields = [
            "company",
            "jobTitle",
            "jobUrl",
            "location",
            "salary",
            "jobType",
            "category",
            "description",
            "status",
            "appliedDate",
            "notes"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (
                Object.prototype.hasOwnProperty.call(
                    req.body,
                    field
                )
            ) {
                updateData[field] =
                    req.body[field];
            }
        });

        const job =
            await Job.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.userId
                },
                {
                    $set: updateData
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        return res.status(200).json({
            message: "Job updated successfully",
            job
        });
    } catch (error) {
        console.error(
            "Update Job Error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Delete job
const deleteJob = async (req, res) => {
    try {
        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job =
            await Job.findOneAndDelete({
                _id: req.params.id,
                user: req.userId
            });

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        return res.status(200).json({
            message: "Job deleted successfully"
        });
    } catch (error) {
        console.error(
            "Delete Job Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Analytics
const getAnalytics = async (req, res) => {
    try {
        const userId =
            new mongoose.Types.ObjectId(
                req.userId
            );

        const totalJobs =
            await Job.countDocuments({
                user: userId
            });

        const statusCounts =
            await Job.aggregate([
                {
                    $match: {
                        user: userId
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]);

        const analytics = {
            totalJobs,
            Wishlist: 0,
            Applied: 0,
            Screening: 0,
            Interview: 0,
            Offer: 0,
            Rejected: 0
        };

        statusCounts.forEach((item) => {
            if (
                item._id in
                analytics
            ) {
                analytics[item._id] =
                    item.count;
            }
        });

        return res.status(200).json({
            analytics
        });
    } catch (error) {
        console.error(
            "Analytics Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createJob,
    searchExternalJobs,
    saveJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob,
    getAnalytics
};