import { useEffect, useState } from "react";
import axios from "axios";
import "./CareerRoadmap.css";

const API_URL = "http://localhost:5000/api/career-roadmap";

function CareerRoadmap() {
    const [targetRole, setTargetRole] = useState("");
    const [currentSkills, setCurrentSkills] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSaved, setLoadingSaved] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [roadmap, setRoadmap] = useState(null);
    const [savedRoadmaps, setSavedRoadmaps] = useState([]);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const fetchRoadmaps = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            setSavedRoadmaps(response.data.roadmaps || []);
        } catch (error) {
            console.error("Fetch Roadmaps Error:", error);
        } finally {
            setLoadingSaved(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!targetRole.trim()) {
            setError("Please enter your target role.");
            return;
        }

        if (!currentSkills.trim()) {
            setError("Please enter your current skills.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const skills = currentSkills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);

            const response = await axios.post(
                API_URL,
                {
                    targetRole,
                    currentSkills: skills
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            const newRoadmap = response.data.roadmap;

            setRoadmap(newRoadmap);

            setSavedRoadmaps((prev) => [
                newRoadmap,
                ...prev.filter((item) => item._id !== newRoadmap._id)
            ]);

        } catch (error) {
            console.error("Roadmap Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to generate career roadmap."
            );
        } finally {
            setLoading(false);
        }
    };

    const selectRoadmap = (item) => {
        setRoadmap(item);

        setTargetRole(item.targetRole);

        setCurrentSkills(
            item.currentSkills.join(", ")
        );

        setError("");
    };

    const deleteRoadmap = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this roadmap?"
        );

        if (!confirmDelete) {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            setSavedRoadmaps((prev) =>
                prev.filter((item) => item._id !== id)
            );

            if (roadmap?._id === id) {
                setRoadmap(null);
                setTargetRole("");
                setCurrentSkills("");
            }

        } catch (error) {
            console.error("Delete Roadmap Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete roadmap."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="career-roadmap">

            <div className="roadmap-header">
                <span>AI CAREER ROADMAP</span>

                <h1>Build your path to your dream role.</h1>

                <p>
                    Tell us your target role and current skills to create
                    a personalized career roadmap.
                </p>
            </div>

            <div className="roadmap-form-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Target Role</label>

                        <input
                            type="text"
                            placeholder="e.g. Full Stack Developer"
                            value={targetRole}
                            onChange={(e) => {
                                setTargetRole(e.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Current Skills</label>

                        <textarea
                            placeholder="e.g. JavaScript, React.js, Node.js, MongoDB"
                            value={currentSkills}
                            onChange={(e) => {
                                setCurrentSkills(e.target.value);
                                setError("");
                            }}
                        />

                        <small>
                            Separate multiple skills with commas.
                        </small>
                    </div>

                    {error && (
                        <div className="roadmap-error">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Generating Roadmap..."
                            : "Generate AI Roadmap"}
                    </button>

                </form>

            </div>

            {!loadingSaved && savedRoadmaps.length > 0 && (
                <div className="saved-roadmaps">

                    <div className="saved-roadmaps-header">
                        <h2>Saved Roadmaps</h2>

                        <span>
                            {savedRoadmaps.length} saved
                        </span>
                    </div>

                    <div className="saved-roadmap-list">

                        {savedRoadmaps.map((item) => (
                            <div
                                className={
                                    roadmap?._id === item._id
                                        ? "saved-roadmap active"
                                        : "saved-roadmap"
                                }
                                key={item._id}
                            >

                                <button
                                    type="button"
                                    onClick={() => selectRoadmap(item)}
                                >
                                    <strong>
                                        {item.targetRole}
                                    </strong>

                                    <small>
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </small>
                                </button>

                                <button
                                    type="button"
                                    className="delete-roadmap-button"
                                    onClick={() => deleteRoadmap(item._id)}
                                    disabled={deleting}
                                >
                                    Delete
                                </button>

                            </div>
                        ))}

                    </div>

                </div>
            )}

            {roadmap && (
                <div className="roadmap-result">

                    <div className="result-header">
                        <span>YOUR AI ROADMAP</span>

                        <h2>
                            {roadmap.targetRole}
                        </h2>
                    </div>

                    <div className="roadmap-section">

                        <h3>Current Skills</h3>

                        <div className="skill-list">

                            {roadmap.currentSkills.map(
                                (skill, index) => (
                                    <span key={index}>
                                        {skill}
                                    </span>
                                )
                            )}

                        </div>

                    </div>

                    <div className="roadmap-section">

                        <h3>Missing Skills</h3>

                        <div className="skill-list">

                            {roadmap.missingSkills.map(
                                (skill, index) => (
                                    <span key={index}>
                                        {skill}
                                    </span>
                                )
                            )}

                        </div>

                    </div>

                    <div className="roadmap-levels">

                        <div className="roadmap-level">

                            <div className="level-title beginner">
                                Beginner
                            </div>

                            {roadmap.beginner.map(
                                (item, index) => (
                                    <p key={index}>
                                        {item}
                                    </p>
                                )
                            )}

                        </div>

                        <div className="roadmap-level">

                            <div className="level-title intermediate">
                                Intermediate
                            </div>

                            {roadmap.intermediate.map(
                                (item, index) => (
                                    <p key={index}>
                                        {item}
                                    </p>
                                )
                            )}

                        </div>

                        <div className="roadmap-level">

                            <div className="level-title advanced">
                                Advanced
                            </div>

                            {roadmap.advanced.map(
                                (item, index) => (
                                    <p key={index}>
                                        {item}
                                    </p>
                                )
                            )}

                        </div>

                    </div>

                    <div className="roadmap-section priorities">

                        <h3>Learning Priorities</h3>

                        {roadmap.priorities.map(
                            (item, index) => (
                                <div key={index}>
                                    <strong>
                                        {index + 1}
                                    </strong>

                                    <span>
                                        {item}
                                    </span>
                                </div>
                            )
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}

export default CareerRoadmap;