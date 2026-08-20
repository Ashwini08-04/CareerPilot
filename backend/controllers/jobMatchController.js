// Match resume with job description
const JobMatch = require("../models/JobMatch");
const Resume = require("../models/Resume");
const { matchResumeWithJob } = require("../services/aiService");

const createJobMatch = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        const resume = await Resume.findOne({
            user: req.userId
        }).sort({
            createdAt: -1
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        const analysis = await matchResumeWithJob(
            resume.extractedText,
            jobDescription
        );

        const jobMatch = await JobMatch.create({
            user: req.userId,
            resume: resume._id,
            jobDescription,
            ...analysis
        });

        res.status(201).json({
            message: "Job match created successfully",
            jobMatch
        });
    } catch (error) {
        res.status(500).json({
            message: "Job matching failed",
            error: error.message
        });
    }
};

// Get job match history
const getJobMatches = async (req, res) => {
    try {
        const matches = await JobMatch.find({
            user: req.userId
        })
            .populate("resume", "fileName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: matches.length,
            matches
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch job matches",
            error: error.message
        });
    }
};

module.exports = {
    createJobMatch,
    getJobMatches
};