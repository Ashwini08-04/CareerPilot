const express = require("express");

const {
    createResume,
    getResume,
    updateResume,
    deleteResume
} = require("../controllers/resumeBuilderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createResume);
router.get("/", protect, getResume);
router.put("/", protect, updateResume);
router.delete("/:id", protect, deleteResume);

module.exports = router;