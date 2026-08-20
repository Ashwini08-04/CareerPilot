const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        jobDescription: {
            type: String,
            required: true
        },

        questions: [
            {
                question: {
                    type: String,
                    required: true
                },

                modelAnswer: {
                    type: String,
                    required: true
                },

                candidateAnswer: {
                    type: String,
                    default: ""
                },

                category: {
                    type: String,
                    required: true
                },

                score: {
                    type: Number,
                    default: 0
                },

                feedback: {
                    type: String,
                    default: ""
                },

                improvement: {
                    type: String,
                    default: ""
                }
            }
        ],

        status: {
            type: String,
            enum: ["in-progress", "completed"],
            default: "in-progress"
        },

        totalScore: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Interview", interviewSchema);