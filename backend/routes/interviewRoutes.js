const express = require("express");

const {
    createInterview,
    getInterviews,
    getInterview,
    submitAnswer
} = require("../controllers/interviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create interview
router.post("/", protect, createInterview);

// Get interview history
router.get("/", protect, getInterviews);

// Get single interview
router.get("/:id", protect, getInterview);

// Submit and evaluate answer
router.post("/submit-answer", protect, submitAnswer);


module.exports = router;