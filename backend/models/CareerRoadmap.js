const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        targetRole: {
            type: String,
            required: true,
            trim: true
        },

        currentSkills: {
            type: [String],
            default: []
        },

        missingSkills: {
            type: [String],
            default: []
        },

        beginner: {
            type: [String],
            default: []
        },

        intermediate: {
            type: [String],
            default: []
        },

        advanced: {
            type: [String],
            default: []
        },

        priorities: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CareerRoadmap", roadmapSchema);