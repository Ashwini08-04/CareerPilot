// Job match schema
const mongoose = require("mongoose");

const jobMatchSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true
        },

        jobDescription: {
            type: String,
            required: true
        },

        matchPercentage: {
            type: Number,
            required: true
        },

        matchedSkills: {
            type: [String],
            default: []
        },

        missingSkills: {
            type: [String],
            default: []
        },

        recommendations: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("JobMatch", jobMatchSchema);