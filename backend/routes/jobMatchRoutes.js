const express = require("express");

const {
    createJobMatch,
    getJobMatches
} = require("../controllers/jobMatchController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/job-match:
 *   post:
 *     summary: Create a job match analysis
 *     tags: [Job Match]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 example: Full Stack Developer
 *               company:
 *                 type: string
 *                 example: Google
 *               jobDescription:
 *                 type: string
 *                 example: Looking for a Full Stack Developer with React, Node.js, MongoDB and REST API experience.
 *     responses:
 *       201:
 *         description: Job match created successfully
 *       400:
 *         description: Invalid job match data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post("/", protect, createJobMatch);

/**
 * @swagger
 * /api/job-match:
 *   get:
 *     summary: Get all job match analyses for current user
 *     tags: [Job Match]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job matches retrieved successfully
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get("/", protect, getJobMatches);

module.exports = router;