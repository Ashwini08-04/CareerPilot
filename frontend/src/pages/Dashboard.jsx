import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";
import AIAssistant from "../components/AICompanion";
import "./Dashboard.css";

function Dashboard() {
    const { user } = useAuth();

    const [analytics, setAnalytics] = useState(null);
    const [jobMatch, setJobMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [analyticsData, matchData] = await Promise.all([
                    apiRequest("/jobs/analytics"),
                    apiRequest("/job-match")
                ]);

                setAnalytics(analyticsData.analytics);
                setJobMatch(matchData.matches?.[0] || null);
            } catch (error) {
                console.error("Dashboard data error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const totalJobs = analytics?.totalJobs || 0;
    const appliedCount = analytics?.Applied || 0;
    const interviewCount = analytics?.Interview || 0;
    const offerCount = analytics?.Offer || 0;
    const rejectedCount = analytics?.Rejected || 0;
    const matchScore = jobMatch?.matchPercentage || 0;

    const careerProgress = totalJobs
        ? Math.min(Math.round((totalJobs / 10) * 100), 100)
        : 0;

    return (
        <div className="dashboard-main">

            <header className="dashboard-topbar">
                <div>
                    <span className="dashboard-label">
                        CAREERPILOT
                    </span>

                    <h1>
                        Good morning, {user?.name || "there"} 👋
                    </h1>

                    <p>
                        Here's your career progress at a glance.
                    </p>
                </div>
            </header>

            {loading ? (
                <p className="dashboard-message">
                    Loading your career data...
                </p>
            ) : (
                <>
                    <section className="dashboard-content">

                        <div className="dashboard-card">
                            <span>Job Applications</span>
                            <strong>{totalJobs}</strong>
                            <small>Total</small>
                        </div>

                        <div className="dashboard-card">
                            <span>Applied</span>
                            <strong>{appliedCount}</strong>
                            <small>Applications</small>
                        </div>

                        <div className="dashboard-card">
                            <span>Interviews</span>
                            <strong>{interviewCount}</strong>
                            <small>Scheduled</small>
                        </div>

                        <div className="dashboard-card">
                            <span>Job Match</span>
                            <strong>{matchScore}%</strong>
                            <small>Best match</small>
                        </div>

                    </section>

                    <section className="dashboard-lower">

                        <div className="progress-card">

                            <div className="card-heading">
                                <div>
                                    <span>CAREER PROGRESS</span>
                                    <h2>Your career journey</h2>
                                </div>

                                <strong>{careerProgress}%</strong>
                            </div>

                            <div className="progress-bar">
                                <div
                                    style={{
                                        width: `${careerProgress}%`
                                    }}
                                ></div>
                            </div>

                            <div className="progress-steps">
                                <span>Resume</span>
                                <span>Skills</span>
                                <span>Jobs</span>
                                <span>Interview</span>
                                <span>Goal</span>
                            </div>

                        </div>

                        <div className="insight-card">

                            <span>✦ AI INSIGHT</span>

                            <h2>Your next best move</h2>

                            <p>
                                You have {interviewCount} interview
                                {interviewCount !== 1 ? "s" : ""} and{" "}
                                {offerCount} offer
                                {offerCount !== 1 ? "s" : ""}.
                            </p>

                            <Link to="/dashboard/ai-insights">
                                View analytics →
                            </Link>

                        </div>

                    </section>

                    <section className="target-role">

                        <div>
                            <span>TARGET ROLE</span>

                            <h2>Frontend Developer</h2>

                            <p>
                                Based on your current skills and career goals.
                            </p>
                        </div>

                        <div className="role-match">
                            <strong>{matchScore}%</strong>
                            <span>Match</span>
                        </div>

                    </section>

                    <section className="applications-dashboard-card">

                        <div>
                            <span>JOB APPLICATIONS</span>

                            <h2>Track your opportunities</h2>

                            <p>
                                {totalJobs} total applications,{" "}
                                {rejectedCount} rejected.
                            </p>
                        </div>

                        <Link to="/dashboard/applications">
                            View Applications →
                        </Link>

                    </section>

                    <section className="applications-dashboard-card">

                        <div>
                            <span>✦ AI CAREER TOOL</span>

                            <h2>AI Job Match</h2>

                            <p>
                                Compare your resume with a job description
                                and discover your match score and skill gaps.
                            </p>
                        </div>

                        <Link to="/dashboard/job-match">
                            Analyze Job →
                        </Link>

                    </section>

                    <AIAssistant />

                </>
            )}

        </div>
    );
}

export default Dashboard;