const express = require("express");

const {
    askCareerAssistant
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Ask CareerPilot AI
router.post("/assistant", protect, askCareerAssistant);

module.exports = router;