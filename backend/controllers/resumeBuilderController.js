const ResumeBuilder = require("../models/ResumeBuilder");
// Create resume
const createResume = async (req, res) => {
    try {
        const resume = await ResumeBuilder.create({
            user: req.userId,
            ...req.body
        });

        res.status(201).json({
            message: "Resume created successfully",
            resume
        });
    } catch (error) {
        console.error("Create Resume Error:", error);

        res.status(500).json({
            message: "Failed to create resume",
            error: error.message
        });
    }
};

// Get current user's resume
const getResume = async (req, res) => {
    try {
        const resume = await ResumeBuilder.findOne({
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.status(200).json({
            resume
        });
    } catch (error) {
        console.error("Get Resume Error:", error);

        res.status(500).json({
            message: "Failed to get resume",
            error: error.message
        });
    }
};

// Update resume
const updateResume = async (req, res) => {
    try {
        const resume = await ResumeBuilder.findOneAndUpdate(
            { user: req.userId },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.status(200).json({
            message: "Resume updated successfully",
            resume
        });
    } catch (error) {
        console.error("Update Resume Error:", error);

        res.status(500).json({
            message: "Failed to update resume",
            error: error.message
        });
    }
};

// Delete resume
const deleteResume = async (req, res) => {
    try {
        const resume = await ResumeBuilder.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.status(200).json({
            message: "Resume deleted successfully"
        });
    } catch (error) {
        console.error("Delete Resume Error:", error);

        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        });
    }
};

module.exports = {
    createResume,
    getResume,
    updateResume,
    deleteResume
};