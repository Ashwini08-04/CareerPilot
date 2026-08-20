const express = require("express");

const {
    createJob,
    searchExternalJobs,
    saveJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob,
    getAnalytics
} = require("../controllers/jobController");

const {
    aiSearchJobs
} = require("../controllers/aiJobSearchController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);


// Normal job search
router.get(
    "/search",
    searchExternalJobs
);


// AI job search
router.post(
    "/ai-search",
    aiSearchJobs
);


router.get(
    "/analytics",
    getAnalytics
);

router.get(
    "/",
    getJobs
);

router.get(
    "/:id",
    getJob
);

router.post(
    "/",
    createJob
);

router.post(
    "/save",
    saveJob
);

router.put(
    "/:id",
    updateJob
);

router.delete(
    "/:id",
    deleteJob
);

module.exports = router;