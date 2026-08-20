const Interview = require("../models/Interview");
const {
    generateInterviewQuestions,
    evaluateInterviewAnswer
} = require("../services/aiService");


// Create interview
const createInterview = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription?.trim()) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        const result = await generateInterviewQuestions(
            jobDescription
        );

        const interview = await Interview.create({
            user: req.userId,
            jobDescription,
            questions: result.questions
        });

        res.status(201).json({
            message: "Interview preparation created successfully",
            interview
        });

    } catch (error) {
        res.status(500).json({
            message: "Interview generation failed",
            error: error.message
        });
    }
};


// Get interview history
const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            user: req.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            count: interviews.length,
            interviews
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch interviews",
            error: error.message
        });
    }
};


// Get single interview
const getInterview = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        res.status(200).json({
            interview
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch interview",
            error: error.message
        });
    }
};


// Evaluate and save candidate answer
// Evaluate and save candidate answer
const submitAnswer = async (req, res) => {
    try {
        const {
            interviewId,
            questionIndex,
            answer
        } = req.body;

        if (
            !interviewId ||
            questionIndex === undefined ||
            !answer?.trim()
        ) {
            return res.status(400).json({
                message: "Interview ID, question index and answer are required"
            });
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            user: req.userId
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        const question = interview.questions[questionIndex];

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        // Evaluate answer using AI
        const result = await evaluateInterviewAnswer(
            question.question,
            answer
        );

        // Save candidate answer
        question.candidateAnswer = answer;

        // Save AI evaluation
        question.score = result.score;
        question.feedback = result.feedback;
        question.improvement = result.improvement;

        // Calculate total score
        const answeredQuestions = interview.questions.filter(
            (question) =>
                question.candidateAnswer &&
                question.candidateAnswer.trim()
        );

        const totalScore = interview.questions.reduce(
            (total, question) => total + (question.score || 0),
            0
        );

        interview.totalScore = totalScore;

        // Check whether all questions are answered
        if (
            answeredQuestions.length ===
            interview.questions.length
        ) {
            interview.status = "completed";
        } else {
            interview.status = "in-progress";
        }

        await interview.save();

        res.status(200).json({
            message: "Answer evaluated successfully",

            result,

            status: interview.status,

            totalScore: interview.totalScore,

            answeredQuestions: answeredQuestions.length,

            totalQuestions: interview.questions.length
        });

    } catch (error) {
        console.error("Interview Answer Error:", error);

        res.status(500).json({
            message: "Failed to evaluate answer",
            error: error.message
        });
    }
};


module.exports = {
    createInterview,
    getInterviews,
    getInterview,
    submitAnswer
};