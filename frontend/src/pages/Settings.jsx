// User settings and career preferences
import { useEffect, useState } from "react";
import "./Settings.css";

const API_URL = "https://careerpilot-n4ys.onrender.com/api/auth";

function Settings() {
    const [profile, setProfile] = useState({
        name: "",
        email: ""
    });

    const [preferences, setPreferences] = useState({
        jobTitle: "",
        location: "",
        workMode: "",
        expectedSalary: "",
        experienceLevel: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load profile");
            }

            setProfile({
                name: data.user.name,
                email: data.user.email
            });

            setPreferences({
                jobTitle: data.user.preferences?.jobTitle || "",
                location: data.user.preferences?.location || "",
                workMode: data.user.preferences?.workMode || "",
                expectedSalary: data.user.preferences?.expectedSalary || "",
                experienceLevel: data.user.preferences?.experienceLevel || ""
            });
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...profile,
                    preferences
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            setProfile({
                name: data.user.name,
                email: data.user.email
            });

            setPreferences({
                ...preferences,
                ...data.user.preferences
            });

            setMessage("Profile updated successfully.");
        } catch (error) {
            setMessage(error.message);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(passwords)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to change password");
            }

            setPasswords({
                currentPassword: "",
                newPassword: ""
            });

            setMessage("Password changed successfully.");
        } catch (error) {
            setMessage(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="settings-page">
                Loading settings...
            </div>
        );
    }

    return (
        <div className="settings-page">
            <div className="settings-header">
                <span>ACCOUNT SETTINGS</span>
                <h1>Manage your account.</h1>
                <p>
                    Update your profile, career preferences and security.
                </p>
            </div>

            {message && (
                <p className="settings-message">
                    {message}
                </p>
            )}

            <form onSubmit={updateProfile}>
                <div className="settings-card">
                    <div className="settings-card-header">
                        <span>PROFILE</span>
                        <h2>Personal information</h2>
                    </div>

                    <div className="settings-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        name: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        email: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="settings-card-header">
                        <span>CAREER</span>
                        <h2>Job preferences</h2>
                    </div>

                    <div className="settings-grid">
                        <div className="form-group">
                            <label>Preferred Job Title</label>
                            <input
                                type="text"
                                placeholder="Full Stack Developer"
                                value={preferences.jobTitle}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        jobTitle: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Preferred Location</label>
                            <input
                                type="text"
                                placeholder="Pune, Hyderabad"
                                value={preferences.location}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        location: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Work Mode</label>
                            <select
                                value={preferences.workMode}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        workMode: e.target.value
                                    })
                                }
                            >
                                <option value="">Select work mode</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="On-site">On-site</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Expected Salary</label>
                            <input
                                type="text"
                                placeholder="8-12 LPA"
                                value={preferences.expectedSalary}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        expectedSalary: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Experience Level</label>
                            <select
                                value={preferences.experienceLevel}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        experienceLevel: e.target.value
                                    })
                                }
                            >
                                <option value="">Select level</option>
                                <option value="Fresher">Fresher</option>
                                <option value="Entry Level">Entry Level</option>
                                <option value="Mid Level">Mid Level</option>
                                <option value="Senior Level">Senior Level</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit">
                        Save Changes
                    </button>
                </div>
            </form>

            <div className="settings-card">
                <div className="settings-card-header">
                    <span>SECURITY</span>
                    <h2>Change password</h2>
                </div>

                <form onSubmit={changePassword}>
                    <div className="settings-grid">
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        currentPassword: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        newPassword: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>

                    <button type="submit">
                        Change Password
                    </button>
                </form>
            </div>

            <div className="settings-card danger-card">
                <div>
                    <span>ACCOUNT</span>
                    <h2>Sign out</h2>
                    <p>Sign out from your current account.</p>
                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Settings;