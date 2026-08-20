const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        jobUrl: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        salary: {
            type: String,
            trim: true
        },

        jobType: {
            type: String,
            trim: true
        },

        category: {
            type: String,
            trim: true
        },

        description: {
            type: String
        },

        status: {
            type: String,
            enum: [
                "Wishlist",
                "Applied",
                "Screening",
                "Interview",
                "Offer",
                "Rejected"
            ],
            default: "Wishlist"
        },

        appliedDate: {
            type: Date
        },

        notes: {
            type: String,
            trim: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

jobSchema.index({ user: 1, jobUrl: 1 });

module.exports = mongoose.model("Job", jobSchema);