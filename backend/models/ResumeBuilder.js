const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
    jobTitle: String,
    company: String,
    duration: String,
    description: String
});

const educationSchema = new mongoose.Schema({
    degree: String,
    college: String,
    duration: String,
    location: String
});

const projectSchema = new mongoose.Schema({
    name: String,
    technologies: String,
    description: String
});

const resumeBuilderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        template: {
            type: String,
            enum: ["classic", "modern", "minimal"],
            default: "classic"
        },

        fullName: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        github: String,
        summary: String,
        skills: String,

        experience: [experienceSchema],
        education: [educationSchema],
        projects: [projectSchema]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ResumeBuilder",
    resumeBuilderSchema
);