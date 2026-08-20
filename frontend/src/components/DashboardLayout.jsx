import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./DashboardLayout.css";

function DashboardLayout() {
    const { user, logout } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);

    const toggleProfile = () => {
        setProfileOpen(!profileOpen);
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <Link to="/" className="dashboard-logo">
                    CareerPilot
                </Link>

                <div className="sidebar-section">
                    <span>WORKSPACE</span>

                    <Link to="/dashboard">Overview</Link>
                    <Link to="/dashboard/jobs">Jobs</Link>
                    <Link to="/dashboard/resume">Resume</Link>
                    <Link to="/dashboard/skills">Skills</Link>
                    <Link to="/dashboard/resume-builder">Resume Builder</Link>
                    <Link to="/dashboard/career-roadmap">Career Roadmap</Link>
                    <Link to="/dashboard/job-match">Job Match</Link>
                    <Link to="/dashboard/interviews">Interviews</Link>
                    <Link to="/dashboard/ai-insights">AI Insights</Link>
                </div>

                <div className="sidebar-bottom">
                    <Link to="/dashboard/settings">Settings</Link>
                </div>
            </aside>

            <div className="dashboard-area">
                <header className="dashboard-header">
                    <span>CAREERPILOT</span>

                    <div className="profile-wrapper">
                        <button
                            className="dashboard-user"
                            onClick={toggleProfile}
                        >
                            <div className="user-avatar">
                                {user?.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : "U"}
                            </div>

                            <span>{user?.name || "User"}</span>

                            <span
                                className={`profile-arrow ${
                                    profileOpen ? "open" : ""
                                }`}
                            ></span>
                        </button>

                        {profileOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-info">
                                    <div className="profile-avatar">
                                        {user?.name
                                            ? user.name.charAt(0).toUpperCase()
                                            : "U"}
                                    </div>

                                    <div>
                                        <strong>
                                            {user?.name || "User"}
                                        </strong>

                                        <span>
                                            {user?.email || "No email"}
                                        </span>
                                    </div>
                                </div>

                                <div className="profile-divider"></div>

                                <Link
                                    to="/dashboard/settings"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <span>○</span>
                                    Profile
                                </Link>

                                <Link
                                    to="/dashboard/settings"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <span>⚙</span>
                                    Settings
                                </Link>

                                <Link
                                    to="/dashboard/settings"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <span>♙</span>
                                    Security
                                </Link>

                                <div className="profile-divider"></div>

                                <button
                                    className="profile-logout"
                                    onClick={logout}
                                >
                                    <span>↪</span>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="dashboard-page">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;