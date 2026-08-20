const CareerRoadmap = require("../models/CareerRoadmap");
const generateCareerRoadmap = require("../services/careerRoadmapService");

const createRoadmap = async (req, res) => {
    try {
        const { targetRole, currentSkills } = req.body;

        if (!targetRole) {
            return res.status(400).json({
                message: "Target role is required"
            });
        }

        const skills = Array.isArray(currentSkills)
            ? currentSkills
            : currentSkills
                ? currentSkills.split(",").map((skill) => skill.trim())
                : [];

        const roadmapData = await generateCareerRoadmap(
            targetRole,
            skills
        );

        const roadmap = await CareerRoadmap.create({
            user: req.userId,
            targetRole,
            ...roadmapData
        });

        res.status(201).json({
            message: "AI career roadmap created successfully",
            roadmap
        });
    } catch (error) {
        console.error("Create Roadmap Error:", error);

        res.status(500).json({
            message: "Failed to generate career roadmap",
            error: error.message
        });
    }
};
const getRoadmaps = async (req, res) => {
    try {
        const roadmaps = await CareerRoadmap.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            roadmaps
        });
    } catch (error) {
        console.error("Get Roadmaps Error:", error);

        res.status(500).json({
            message: "Failed to get career roadmaps",
            error: error.message
        });
    }
};

const getRoadmap = async (req, res) => {
    try {
        const roadmap = await CareerRoadmap.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!roadmap) {
            return res.status(404).json({
                message: "Career roadmap not found"
            });
        }

        res.status(200).json({
            roadmap
        });
    } catch (error) {
        console.error("Get Roadmap Error:", error);

        res.status(500).json({
            message: "Failed to get career roadmap",
            error: error.message
        });
    }
};

const deleteRoadmap = async (req, res) => {
    try {
        const roadmap = await CareerRoadmap.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!roadmap) {
            return res.status(404).json({
                message: "Career roadmap not found"
            });
        }

        res.status(200).json({
            message: "Career roadmap deleted successfully"
        });
    } catch (error) {
        console.error("Delete Roadmap Error:", error);

        res.status(500).json({
            message: "Failed to delete career roadmap",
            error: error.message
        });
    }
};

module.exports = {
    createRoadmap,
    getRoadmaps,
    getRoadmap,
    deleteRoadmap
};