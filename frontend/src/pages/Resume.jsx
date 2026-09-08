import { useEffect, useState } from "react";
import "./Resume.css";

const API_URL = "https://careerpilot-n4ys.onrender.com/api/resume";

function Resume() {
    const [file, setFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    // Fetch current resume
    const fetchResume = async () => {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setResume(data.resume);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchResume();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            setMessage("Please upload a PDF resume.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setMessage("File size must be less than 5MB.");
            return;
        }

        setFile(selectedFile);
        setAnalysis(null);
        setMessage("");
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select your resume first.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const formData = new FormData();
            formData.append("resume", file);

            const response = await fetch(`${API_URL}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            setResume(data.resume);
            setFile(null);
            setAnalysis(null);
            setMessage("Resume uploaded successfully.");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        try {
            setAnalyzing(true);
            setAnalysis(null);
            setMessage("");

            const response = await fetch(`${API_URL}/analyze`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Analysis failed");
            }

            setAnalysis(data.analysis);
            setMessage("AI analysis completed.");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleDeleteResume = async () => {
        try {
            setDeleting(true);
            setMessage("");

            const response = await fetch(API_URL, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            setResume(null);
            setFile(null);
            setAnalysis(null);
            setMessage("Resume deleted successfully.");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="resume-page">

            <div className="resume-header">
                <span>AI RESUME INTELLIGENCE</span>

                <h1>Build a resume that gets noticed.</h1>

                <p>
                    Upload your resume and let CareerPilot
                    analyze your skills, strengths and career opportunities.
                </p>
            </div>

            <div className="resume-upload-card">

                <div className="upload-icon">↑</div>

                <h2>
                    {resume ? "Update your resume" : "Upload your resume"}
                </h2>

                <p>PDF files up to 5MB</p>

                <label className="upload-button">
                    Choose Resume
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                </label>

                {file && (
                    <div className="selected-file">
                        <span>📄</span>

                        <div>
                            <strong>{file.name}</strong>
                            <small>Ready to upload</small>
                        </div>
                    </div>
                )}

                {file && (
                    <button
                        className="analyze-button"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload Resume →"}
                    </button>
                )}

                {resume && !file && (
                    <div className="selected-file resume-file-card">
                        <span className="file-icon">📄</span>

                        <div className="file-details">
                            <strong>{resume.fileName}</strong>
                            <small>Resume uploaded successfully</small>
                        </div>

                        <button
                            className="delete-resume"
                            onClick={handleDeleteResume}
                            disabled={deleting}
                            title="Delete resume"
                        >
                            ×
                        </button>
                    </div>
                )}

                {resume && (
                    <button
                        className="ai-button"
                        onClick={handleAnalyze}
                        disabled={analyzing}
                    >
                        {analyzing
                            ? "Analyzing..."
                            : "✦ Analyze Resume with AI"}
                    </button>
                )}

                {message && (
                    <p className="resume-message">{message}</p>
                )}
            </div>

            {analysis && (
                <div className="analysis-container">

                    <div className="analysis-title">
                        <span>✦ AI ANALYSIS</span>

                        <h2>Your resume insights</h2>

                        <p>
                            Here's what CareerPilot found in your resume.
                        </p>
                    </div>

                    <div className="analysis-overview">

                        <div className="score-card">
                            <span>RESUME SCORE</span>
                            <strong>{analysis.score}</strong>
                            <small>out of 100</small>
                        </div>

                        <div className="summary-card">
                            <span>AI SUMMARY</span>
                            <p>{analysis.summary}</p>
                        </div>

                    </div>

                    <div className="skills-section">

                        <span>SKILLS DETECTED</span>

                        <div className="skills-list">
                            {analysis.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="skill-pill"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                    </div>

                    <div className="analysis-grid">

                        <div className="insight-card strengths">

                            <span>✦ STRENGTHS</span>

                            <h3>What's working well</h3>

                            <ul>
                                {analysis.strengths?.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>

                        </div>

                        <div className="insight-card weaknesses">

                            <span>AREAS TO IMPROVE</span>

                            <h3>Where you can grow</h3>

                            <ul>
                                {analysis.weaknesses?.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>

                        </div>

                    </div>

                    <div className="recommendations-card">

                        <span>✦ AI RECOMMENDATIONS</span>

                        <h3>Your next best moves</h3>

                        <div className="recommendation-list">
                            {analysis.suggestions?.map((item, index) => (
                                <div
                                    className="recommendation"
                                    key={index}
                                >
                                    <strong>
                                        {String(index + 1).padStart(2, "0")}
                                    </strong>

                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Resume;