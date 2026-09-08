import { useEffect, useState } from "react";
import "./Skills.css";

const API_URL = "https://careerpilot-n4ys.onrender.com/api/resume";

function Skills() {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [editing, setEditing] = useState(null);
    const [editSkill, setEditSkill] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const fetchSkills = async () => {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSkills(data.resume?.analysis?.skills || []);
            }
        } catch (error) {
            console.error("Failed to load skills:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const addSkill = async () => {
        if (!newSkill.trim()) return;

        try {
            const response = await fetch(`${API_URL}/skills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    skill: newSkill.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add skill"
                );
            }

            setSkills(data.skills);
            setNewSkill("");
            setMessage("Skill added successfully.");
        } catch (error) {
            setMessage(error.message);
        }
    };

    const startEdit = (index, skill) => {
        setEditing(index);
        setEditSkill(skill);
        setMessage("");
    };

    const updateSkill = async () => {
        if (!editSkill.trim()) return;

        try {
            const response = await fetch(
                `${API_URL}/skills/${editing}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        skill: editSkill.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update skill"
                );
            }

            setSkills(data.skills);
            setEditing(null);
            setEditSkill("");
            setMessage("Skill updated successfully.");
        } catch (error) {
            setMessage(error.message);
        }
    };

    const deleteSkill = async (index) => {
        try {
            const response = await fetch(
                `${API_URL}/skills/${index}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete skill"
                );
            }

            setSkills(data.skills);
            setMessage("Skill deleted successfully.");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="skills-page">

            <header className="skills-header">
                <div>
                    <span>SKILL INTELLIGENCE</span>

                    <h1>Your technical strengths.</h1>

                    <p>
                        Manage the skills detected from your resume
                        and keep your professional profile up to date.
                    </p>
                </div>

                <div className="skills-summary">
                    <strong>{skills.length}</strong>
                    <span>Total Skills</span>
                </div>
            </header>

            {message && (
                <div className="skills-message">
                    <span>✓</span>
                    {message}
                </div>
            )}

            <section className="skills-card">

                <div className="skills-card-header">
                    <div>
                        <span>YOUR SKILLS</span>
                        <h2>Professional skill set</h2>
                        <p>
                            Skills extracted from your resume and
                            manually added by you.
                        </p>
                    </div>

                    <div className="skills-count">
                        {skills.length}
                    </div>
                </div>

                <div className="add-skill-section">

                    <div className="add-skill-input">
                        <span>+</span>

                        <input
                            type="text"
                            placeholder="Add a skill, e.g. React.js"
                            value={newSkill}
                            onChange={(e) =>
                                setNewSkill(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addSkill();
                                }
                            }}
                        />
                    </div>

                    <button
                        className="add-skill-btn"
                        onClick={addSkill}
                    >
                        Add Skill
                    </button>

                </div>

                {loading ? (
                    <div className="skills-loading">
                        <div className="loading-line"></div>
                        <div className="loading-line short"></div>
                        <p>Loading your skills...</p>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="skills-empty">
                        <div className="empty-icon">+</div>

                        <h3>No skills added yet</h3>

                        <p>
                            Add your technical and professional
                            skills to build your career profile.
                        </p>
                    </div>
                ) : (
                    <div className="skills-list">

                        {skills.map((skill, index) => (

                            <div
                                className="skill-item"
                                key={`${skill}-${index}`}
                            >

                                {editing === index ? (

                                    <div className="skill-edit">

                                        <input
                                            value={editSkill}
                                            onChange={(e) =>
                                                setEditSkill(
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter"
                                                ) {
                                                    updateSkill();
                                                }
                                            }}
                                            autoFocus
                                        />

                                        <button
                                            className="edit-save-btn"
                                            onClick={updateSkill}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="cancel-btn"
                                            onClick={() => {
                                                setEditing(null);
                                                setEditSkill("");
                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                ) : (

                                    <>
                                        <div className="skill-content">
                                            <span className="skill-dot"></span>

                                            <span className="skill-name">
                                                {skill}
                                            </span>
                                        </div>

                                        <div className="skill-actions">

                                            <button
                                                onClick={() =>
                                                    startEdit(
                                                        index,
                                                        skill
                                                    )
                                                }
                                                title="Edit skill"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteSkill(
                                                        index
                                                    )
                                                }
                                                title="Delete skill"
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </>

                                )}

                            </div>

                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Skills;