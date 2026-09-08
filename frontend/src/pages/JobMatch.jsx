import { useState } from "react";
import "./JobMatch.css";

const API_URL = "https://careerpilot-n4ys.onrender.com/api/job-match";

function JobMatch() {
    const [jobDescription, setJobDescription] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleAnalyze = async (e) => {
        e.preventDefault();

        if (!jobDescription.trim()) {
            setMessage("Please enter a job description.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setResult(null);

            const token = localStorage.getItem("token");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobDescription: jobDescription.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Job matching failed"
                );
            }

            setResult(data.jobMatch);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="job-match-page">

            <div className="job-match-header">
                <span>AI CAREER TOOL</span>

                <h1>Job Match</h1>

                <p>
                    See how well your resume matches a job
                    using AI-powered analysis.
                </p>
            </div>

            <form
                className="job-match-form"
                onSubmit={handleAnalyze}
            >
                <label>Job Description</label>

                <textarea
                    value={jobDescription}
                    onChange={(e) =>
                        setJobDescription(e.target.value)
                    }
                    placeholder="Paste the complete job description here..."
                    rows="12"
                    required
                />

                {message && (
                    <p className="job-match-message">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Analyzing Resume..."
                        : "Analyze Job Match →"}
                </button>
            </form>

            {result && (
                <section className="job-match-result">

                    <div className="match-score">
                        <span>RESUME MATCH</span>

                        <strong>
                            {result.matchPercentage}%
                        </strong>

                        <p>
                            Overall match with this job
                        </p>
                    </div>

                    <div className="match-section">
                        <h2>Matched Skills</h2>

                        <div className="skills-list">
                            {result.matchedSkills?.map(
                                (skill, index) => (
                                    <span key={index}>
                                        ✓ {skill}
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    <div className="match-section">
                        <h2>Missing Skills</h2>

                        <div className="skills-list">
                            {result.missingSkills?.map(
                                (skill, index) => (
                                    <span key={index}>
                                        {skill}
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    <div className="match-section">
                        <h2>AI Recommendations</h2>

                        <ul>
                            {result.recommendations?.map(
                                (recommendation, index) => (
                                    <li key={index}>
                                        {recommendation}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                </section>
            )}

        </div>
    );
}

export default JobMatch;