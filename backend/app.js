const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const resumeBuilderRoutes = require("./routes/resumeBuilderRoutes");
const jobMatchRoutes = require("./routes/jobMatchRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const careerRoadmapRoutes = require("./routes/careerRoadmapRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// General API rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests, please try again later"
    }
});

// Authentication rate limit
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many authentication attempts, please try again later"
    }
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

// Swagger documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            persistAuthorization: true
        }
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resume-builder", resumeBuilderRoutes);
app.use("/api/job-match", jobMatchRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/career-roadmap", careerRoadmapRoutes);

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "CareerPilot API is running"
    });
});

// Error handler
app.use(errorHandler);

// Export app for testing
module.exports = app;