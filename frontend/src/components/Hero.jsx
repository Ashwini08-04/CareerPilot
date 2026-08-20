import {
    ArrowRight,
    Briefcase,
    FileText,
    LockKeyhole,
    Settings,
    Sparkles,
    Target
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-badge">
                    <Sparkles size={14} />
                    AI-POWERED CAREER PLATFORM
                </div>

                <h1>
                    Build the career
                    <span>you actually want.</span>
                </h1>

                <p>
                    CareerPilot brings your resume, skills, opportunities and
                    interview preparation into one intelligent workspace.
                </p>

                <div className="hero-actions">
                    <Link to="/register" className="hero-primary">
                        Start for free
                        <ArrowRight size={16} />
                    </Link>

                    <a href="#how-it-works" className="hero-secondary">
                        See how it works
                    </a>
                </div>

                <div className="hero-security">
                    <LockKeyhole size={13} />
                    Private, secure and built for your career.
                </div>
            </div>

            <div className="hero-product">
                <div className="app-window">
                    <div className="app-topbar">
                        <div className="app-brand">
                            <span>✦</span>
                            CareerPilot
                        </div>

                        <div className="app-search">
                            Search your career...
                        </div>

                        <div className="app-user">
                            <div className="app-avatar">A</div>
                            <span>Ashwini</span>
                        </div>
                    </div>

                    <div className="app-body">
                        <aside className="app-sidebar">
                            <div className="sidebar-label">WORKSPACE</div>

                            <div className="sidebar-item active">
                                <Target size={13} />
                                Overview
                            </div>

                            <div className="sidebar-item">
                                <Briefcase size={13} />
                                Jobs
                            </div>

                            <div className="sidebar-item">
                                <FileText size={13} />
                                Resume
                            </div>

                            <div className="sidebar-item">
                                <Target size={13} />
                                Skills
                            </div>

                            <div className="sidebar-item">
                                <Sparkles size={13} />
                                AI Insights
                            </div>

                            <div className="sidebar-divider" />

                            <div className="sidebar-item">
                                <Settings size={13} />
                                Settings
                            </div>
                        </aside>

                        <main className="app-main">
                            <div className="app-heading">
                                <div>
                                    <small>CAREERPILOT</small>
                                    <h2>Good morning, Ashwini 👋</h2>
                                    <p>
                                        Here's your career progress at a glance.
                                    </p>
                                </div>

                                <span className="ready-badge">
                                    <i />
                                    On track
                                </span>
                            </div>

                            <div className="score-section">
                                <div>
                                    <small>CAREER READINESS</small>

                                    <div className="score-value">
                                        86 <span>/ 100</span>
                                    </div>

                                    <p>
                                        You're making strong progress toward
                                        your target role.
                                    </p>
                                </div>

                                <div className="score-ring">
                                    <strong>86%</strong>
                                    <span>Ready</span>
                                </div>
                            </div>

                            <div className="metric-grid">
                                <div className="metric">
                                    <small>Resume Score</small>
                                    <strong>91%</strong>
                                    <span>Excellent</span>
                                </div>

                                <div className="metric">
                                    <small>Applications</small>
                                    <strong>24</strong>
                                    <span>8 this month</span>
                                </div>

                                <div className="metric">
                                    <small>Job Match</small>
                                    <strong>89%</strong>
                                    <span>12 matches</span>
                                </div>
                            </div>

                            <div className="app-grid">
                                <div className="progress-card">
                                    <div className="card-title">
                                        <div>
                                            <small>CAREER PROGRESS</small>
                                            <span>Your journey</span>
                                        </div>

                                        <b>72%</b>
                                    </div>

                                    <div className="progress-bar">
                                        <span />
                                    </div>

                                    <div className="career-steps">
                                        <span className="completed">Resume</span>
                                        <span className="completed">Skills</span>
                                        <span className="completed">Jobs</span>
                                        <span>Interview</span>
                                        <span>Goal</span>
                                    </div>
                                </div>

                                <div className="ai-card">
                                    <div className="ai-heading">
                                        <div className="ai-icon">
                                            <Sparkles size={13} />
                                        </div>

                                        <div>
                                            <small>AI INSIGHT</small>
                                            <strong>Your next best move</strong>
                                        </div>
                                    </div>

                                    <p>
                                        Improve TypeScript to unlock more
                                        relevant frontend opportunities.
                                    </p>

                                    <button>
                                        View recommendation
                                        <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;