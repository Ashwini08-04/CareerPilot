const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/aiService");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

// Upload and save resume
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        const fileBuffer = fs.readFileSync(req.file.path);

        const parser = new PDFParse({
            data: fileBuffer
        });

        const pdfData = await parser.getText();

        const existingResume = await Resume.findOne({
            user: req.userId
        });

        if (existingResume) {
            const oldFilePath = existingResume.filePath;

            existingResume.fileName = req.file.filename;
            existingResume.filePath = req.file.path;
            existingResume.extractedText = pdfData.text;
            existingResume.analysis = {
                skills: [],
                strengths: [],
                weaknesses: [],
                suggestions: []
            };

            await existingResume.save();

            if (
                oldFilePath &&
                oldFilePath !== req.file.path &&
                fs.existsSync(oldFilePath)
            ) {
                fs.unlinkSync(oldFilePath);
            }

            await parser.destroy();

            return res.status(200).json({
                message: "Resume updated successfully",
                resume: existingResume
            });
        }

        const resume = await Resume.create({
            user: req.userId,
            fileName: req.file.filename,
            filePath: req.file.path,
            extractedText: pdfData.text
        });

        await parser.destroy();

        res.status(201).json({
            message: "Resume uploaded successfully",
            resume
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get user resume
const getResume = async (req, res) => {
    try {
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

        res.status(200).json({
            resume
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Analyze resume with AI
const analyzeUserResume = async (req, res) => {
    try {
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

        const analysis = await analyzeResume(
            resume.extractedText
        );

        resume.analysis = analysis;

        await resume.save();

        res.status(200).json({
            message: "AI analysis completed successfully",
            analysis,
            resume
        });

    } catch (error) {
        console.error("Resume AI Analysis Error:", error);

        res.status(500).json({
            message: "AI analysis failed",
            error: error.message
        });
    }
};
// Delete current user's resume
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        if (
            resume.filePath &&
            fs.existsSync(resume.filePath)
        ) {
            fs.unlinkSync(resume.filePath);
        }

        await Resume.deleteOne({
            _id: resume._id
        });

        res.status(200).json({
            message: "Resume deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Add skill
const addSkill = async (req, res) => {
    try {
        const { skill } = req.body;

        if (!skill || !skill.trim()) {
            return res.status(400).json({
                message: "Skill is required"
            });
        }

        const resume = await Resume.findOne({
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        const newSkill = skill.trim();

        const exists = resume.analysis.skills.some(
            item => item.toLowerCase() === newSkill.toLowerCase()
        );

        if (exists) {
            return res.status(400).json({
                message: "Skill already exists"
            });
        }

        resume.analysis.skills.push(newSkill);

        await resume.save();

        res.status(201).json({
            message: "Skill added successfully",
            skills: resume.analysis.skills
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Edit skill
const editSkill = async (req, res) => {
    try {
        const { index } = req.params;
        const { skill } = req.body;

        if (!skill || !skill.trim()) {
            return res.status(400).json({
                message: "Skill is required"
            });
        }

        const resume = await Resume.findOne({
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        const skillIndex = Number(index);

        if (
            Number.isNaN(skillIndex) ||
            skillIndex < 0 ||
            skillIndex >= resume.analysis.skills.length
        ) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        const updatedSkill = skill.trim();

        const duplicate = resume.analysis.skills.some(
            (item, i) =>
                i !== skillIndex &&
                item.toLowerCase() === updatedSkill.toLowerCase()
        );

        if (duplicate) {
            return res.status(400).json({
                message: "Skill already exists"
            });
        }

        resume.analysis.skills[skillIndex] = updatedSkill;

        await resume.save();

        res.status(200).json({
            message: "Skill updated successfully",
            skills: resume.analysis.skills
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Delete skill
const deleteSkill = async (req, res) => {
    try {
        const { index } = req.params;

        const resume = await Resume.findOne({
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        const skillIndex = Number(index);

        if (
            Number.isNaN(skillIndex) ||
            skillIndex < 0 ||
            skillIndex >= resume.analysis.skills.length
        ) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        resume.analysis.skills.splice(skillIndex, 1);

        await resume.save();

        res.status(200).json({
            message: "Skill deleted successfully",
            skills: resume.analysis.skills
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    uploadResume,
    getResume,
    analyzeUserResume,
    deleteResume,
    addSkill,
    editSkill,
    deleteSkill
};