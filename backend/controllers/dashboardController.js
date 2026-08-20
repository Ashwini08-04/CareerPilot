const Resume = require("../models/Resume");
const Job = require("../models/Job");
const JobMatch = require("../models/JobMatch");

const getDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        const resume = await Resume.findOne({
            user: userId
        }).sort({ createdAt: -1 });

        const jobs = await Job.find({
            user: userId
        });

        const latestMatch = await JobMatch.findOne({
            user: userId
        }).sort({ createdAt: -1 });

        const skills = resume?.analysis?.skills || [];
        const strengths = resume?.analysis?.strengths || [];
        const weaknesses = resume?.analysis?.weaknesses || [];

        const resumeScore = resume
            ? Math.min(
                100,
                60 +
                skills.length * 2 +
                strengths.length * 2 -
                weaknesses.length
            )
            : 0;

        const skillStrength = Math.min(
            100,
            skills.length * 5
        );

        const jobMatch = latestMatch?.matchPercentage || 0;

        const applicationScore = Math.min(
            100,
            jobs.length * 10
        );

        const careerReadiness = resume
            ? Math.round(
                (
                    resumeScore +
                    skillStrength +
                    jobMatch +
                    applicationScore
                ) / 4
            )
            : 0;

        const completedSteps = [
            !!resume,
            skills.length > 0,
            jobs.length > 0,
            jobs.some(job => job.status === "Interview"),
            jobMatch > 0
        ].filter(Boolean).length;

        const careerProgress = Math.round(
            (completedSteps / 5) * 100
        );

        const insight =
            resume?.analysis?.suggestions?.[0] ||
            "Analyze your resume to get personalized career recommendations.";

        res.status(200).json({
            dashboard: {
                careerReadiness,
                resumeScore,
                skillStrength,
                jobMatch,
                careerProgress,
                totalApplications: jobs.length,
                interviewCount: jobs.filter(
                    job => job.status === "Interview"
                ).length,
                offerCount: jobs.filter(
                    job => job.status === "Offer"
                ).length,
                insight
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getDashboard
};