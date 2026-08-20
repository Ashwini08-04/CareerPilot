import { useState } from "react";
import {
    Sparkles,
    ArrowUp,
    Lightbulb,
    Target,
    FileText,
    Briefcase
} from "lucide-react";
import "./AICompanion.css";

const API_URL = "http://localhost:5000/api/ai/assistant";

function AIAssistant() {
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

            const token = localStorage.getItem("token");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    question,
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
                    data.message || "AI request failed"
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

    const quickQuestions = [
        {
            icon: FileText,
            text: "How can I improve my resume?"
        },
        {
            icon: Target,
            text: "What skills should I learn?"
        },
        {
            icon: Briefcase,
            text: "Which jobs fit my profile?"
        }
    ];

    const handleQuickQuestion = (text) => {
        setQuestion(text);
    };

    return (
        <section className="ai-assistant" id="ai-tools">
            <div className="ai-assistant-inner">

                <div className="ai-assistant-header">
                    <div className="ai-assistant-icon">
                        <Sparkles size={19} />
                    </div>

                    <div>
                        <span>CAREERPILOT AI</span>
                        <h2>Your AI career assistant</h2>
                    </div>
                </div>

                <p className="ai-assistant-description">
                    Get personalized guidance for your resume, skills,
                    job search and career decisions — all in one place.
                </p>

                <div className="ai-chat-card">

                    <div className="ai-chat-top">
                        <div className="ai-avatar">
                            <Sparkles size={16} />
                        </div>

                        <div>
                            <strong>CareerPilot AI</strong>
                            <span>
                                Your intelligent career companion
                            </span>
                        </div>

                        <div className="ai-online">
                            <i />
                            Online
                        </div>
                    </div>

                    <div className="ai-welcome">
                        <div className="welcome-icon">
                            <Lightbulb size={18} />
                        </div>

                        <div>
                            <strong>
                                How can I help you today?
                            </strong>

                            <p>
                                Ask me anything about your career,
                                resume, skills or job opportunities.
                            </p>
                        </div>
                    </div>

                    <div className="quick-questions">
                        {quickQuestions.map(
                            ({ icon: Icon, text }) => (
                                <button
                                    key={text}
                                    onClick={() =>
                                        handleQuickQuestion(text)
                                    }
                                >
                                    <Icon size={14} />
                                    {text}
                                </button>
                            )
                        )}
                    </div>

                    <div className="ai-question-box">
                        <input
                            type="text"
                            placeholder="Ask CareerPilot anything..."
                            value={question}
                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    askAI();
                                }
                            }}
                        />

                        <button
                            onClick={askAI}
                            disabled={loading || !question.trim()}
                        >
                            <ArrowUp size={16} />
                        </button>
                    </div>

                    {loading && (
                        <div className="ai-status">
                            <span className="typing">
                                <i />
                                <i />
                                <i />
                            </span>
                            CareerPilot is thinking...
                        </div>
                    )}

                    {error && (
                        <div className="ai-error">
                            {error}
                        </div>
                    )}

                    {answer && !loading && (
                        <div className="ai-response">

                            <div className="ai-response-title">
                                <Sparkles size={14} />
                                CareerPilot AI
                            </div>

                            <p>{answer}</p>

                            {suggestions.length > 0 && (
                                <div className="ai-suggestions">
                                    <span>Recommended next steps</span>

                                    {suggestions.map(
                                        (suggestion, index) => (
                                            <div key={index}>
                                                <i>✓</i>
                                                {suggestion}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="ai-trust">
                    <span>✦</span>
                    Personalized for your career journey
                    <span>•</span>
                    Secure & private
                </div>

            </div>
        </section>
    );
}

export default AIAssistant;