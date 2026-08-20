const express = require("express");

const {
    createRoadmap,
    getRoadmaps,
    getRoadmap,
    deleteRoadmap
} = require("../controllers/careerRoadmapController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRoadmap);
router.get("/", protect, getRoadmaps);
router.get("/:id", protect, getRoadmap);
router.delete("/:id", protect, deleteRoadmap);

module.exports = router;