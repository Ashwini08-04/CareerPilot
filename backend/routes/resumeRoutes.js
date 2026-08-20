const express = require("express");

const {
    uploadResume,
    getResume,
    analyzeUserResume,
    deleteResume,
    addSkill,
    editSkill,
    deleteSkill
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/upload",
    protect,
    upload.single("resume"),
    (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        next();
    },
    uploadResume
);

router.get("/", protect, getResume);

router.get("/analyze", protect, analyzeUserResume);

router.delete("/", protect, deleteResume);

// Skills
router.post("/skills", protect, addSkill);

router.put("/skills/:index", protect, editSkill);

router.delete("/skills/:index", protect, deleteSkill);

module.exports = router;