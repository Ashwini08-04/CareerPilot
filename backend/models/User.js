const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        preferences: {
            jobTitle: {
                type: String,
                trim: true,
                default: ""
            },

            location: {
                type: String,
                trim: true,
                default: ""
            },

            workMode: {
                type: String,
                enum: ["Remote", "Hybrid", "On-site", ""],
                default: ""
            },

            expectedSalary: {
                type: String,
                trim: true,
                default: ""
            },

            experienceLevel: {
                type: String,
                enum: ["Fresher", "Entry Level", "Mid Level", "Senior Level", ""],
                default: ""
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);