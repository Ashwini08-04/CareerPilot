const {
    careerAssistant,
    evaluateInterviewAnswer
} = require("../services/aiService");

// AI career assistant
const askCareerAssistant = async (req, res) => {
    try {
        const { question, careerData } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const result = await careerAssistant(
            question,
            careerData || {}
        );

        res.status(200).json({
            message: "AI response generated successfully",
            result
        });
    } catch (error) {
        console.error("AI Assistant Controller Error:", error);

        res.status(500).json({
            message: "Failed to generate AI response",
            error: error.message
        });
    }
};

// Evaluate interview answer
const evaluateAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question?.trim() || !answer?.trim()) {
            return res.status(400).json({
                message: "Question and answer are required"
            });
        }

        const result = await evaluateInterviewAnswer(
            question,
            answer
        );

        res.status(200).json({
            message: "Interview answer evaluated successfully",
            result
        });
    } catch (error) {
        console.error("Interview Evaluation Error:", error);

        res.status(500).json({
            message: "Failed to evaluate interview answer",
            error: error.message
        });
    }
};

module.exports = {
    askCareerAssistant,
    evaluateAnswer
};