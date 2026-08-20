import { useState } from "react";
import { Sparkles, ArrowUp } from "lucide-react";
import "./AIInsights.css";

const API_URL = "http://localhost:5000/api/ai/assistant";

function AIInsights() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const askAI = async () => {
        if (!question.trim() || loading) return;

        try {
            setLoading(true);
            setError("");
            setAnswer("");
            setSuggestions([]);

            const token = localStorage.getItem("token");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    question: question.trim(),
                    careerData: {
                        targetRole: "Frontend Developer",
                        skills: [
                            "JavaScript",
                            "React",
                            "Node.js",
                            "MongoDB"
                        ]
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to get AI response"
                );
            }

            setAnswer(data.result?.answer || "");
            setSuggestions(data.result?.suggestions || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-insights-page">

            <div className="ai-insights-header">
                <span>CAREERPILOT AI</span>

                <h1>Your AI career assistant.</h1>

                <p>
                    Ask questions about your resume, skills, jobs,
                    interviews, or career direction.
                </p>
            </div>

            <div className="ai-chat-card">

                <div className="ai-chat-header">
                    <div className="ai-icon">
                        <Sparkles size={18} />
                    </div>

                    <div>
                        <strong>CareerPilot AI</strong>
                        <span>Career assistant</span>
                    </div>

                    <div className="ai-ready">
                        <i></i>
                        Ready
                    </div>
                </div>

                <div className="ai-question">

                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask CareerPilot anything..."
                        rows="4"
                    />

                    <button
                        onClick={askAI}
                        disabled={loading || !question.trim()}
                    >
                        {loading ? "Thinking..." : "Ask AI"}
                        {!loading && <ArrowUp size={15} />}
                    </button>

                </div>

                {error && (
                    <div className="ai-error">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="ai-loading">
                        <Sparkles size={15} />
                        CareerPilot is analyzing your question...
                    </div>
                )}

                {answer && !loading && (
                    <div className="ai-answer">

                        <div className="ai-answer-title">
                            <Sparkles size={14} />
                            CareerPilot AI
                        </div>

                        <p>{answer}</p>

                        {suggestions.length > 0 && (
                            <div className="ai-next-steps">

                                <span>Recommended next steps</span>

                                {suggestions.map(
                                    (suggestion, index) => (
                                        <div key={index}>
                                            <b>{index + 1}</b>
                                            {suggestion}
                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default AIInsights;