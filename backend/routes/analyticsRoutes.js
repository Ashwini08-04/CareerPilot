const express = require("express");

const {
    getAnalytics
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get career and job application analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/", protect, getAnalytics);

module.exports = router;