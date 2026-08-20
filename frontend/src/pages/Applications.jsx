import { useEffect, useState } from "react";
import "./Applications.css";

const API_URL = "http://localhost:5000/api/jobs";

const statuses = [
    "Wishlist",
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Rejected"
];

function Applications() {
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        company: "",
        jobTitle: "",
        jobUrl: "",
        location: "",
        salary: "",
        status: "Applied",
        appliedDate: "",
        notes: ""
    });

    const token = localStorage.getItem("token");

    // Job applications
    const fetchJobs = async () => {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load applications");
            }

            setJobs(data.jobs || []);
        } catch (error) {
            setMessage(error.message);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const jobData = {
                company: form.company.trim(),
                jobTitle: form.jobTitle.trim(),
                status: form.status
            };

            if (form.jobUrl.trim()) {
                jobData.jobUrl = form.jobUrl.trim();
            }

            if (form.location.trim()) {
                jobData.location = form.location.trim();
            }

            if (form.salary.trim()) {
                jobData.salary = form.salary.trim();
            }

            if (form.appliedDate) {
                jobData.appliedDate = form.appliedDate;
            }

            if (form.notes.trim()) {
                jobData.notes = form.notes.trim();
            }

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(jobData)
            });

            const data = await response.json();

            if (!response.ok) {
                const validationMessage = data.errors
                    ?.map((error) => error.msg)
                    .join(", ");

                throw new Error(
                    validationMessage ||
                    data.message ||
                    "Failed to create application"
                );
            }

            setJobs((currentJobs) => [
                data.job,
                ...currentJobs
            ]);

            setForm({
                company: "",
                jobTitle: "",
                jobUrl: "",
                location: "",
                salary: "",
                status: "Applied",
                appliedDate: "",
                notes: ""
            });

            setShowForm(false);
            setMessage("Application added successfully.");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update status");
            }

            setJobs((currentJobs) =>
                currentJobs.map((job) =>
                    job._id === id ? data.job : job
                )
            );
        } catch (error) {
            setMessage(error.message);
        }
    };

    const deleteJob = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete application"
                );
            }

            setJobs((currentJobs) =>
                currentJobs.filter((job) => job._id !== id)
            );

            setMessage("Application deleted successfully.");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="applications-page">

            <div className="applications-header">
                <div>
                    <span>CAREER TRACKER</span>

                    <h1>Job Applications</h1>

                    <p>
                        Keep every opportunity organized in one place.
                    </p>
                </div>

                <button
                    className="add-job-button"
                    onClick={() => {
                        setShowForm(!showForm);
                        setMessage("");
                    }}
                >
                    + Add Application
                </button>
            </div>

            {message && (
                <p className="application-message">
                    {message}
                </p>
            )}

            {showForm && (
                <form
                    className="application-form"
                    onSubmit={handleSubmit}
                >
                    <h2>Add Job Application</h2>

                    <div className="form-grid">

                        <input
                            name="company"
                            placeholder="Company"
                            value={form.company}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="jobTitle"
                            placeholder="Job Title"
                            value={form.jobTitle}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="jobUrl"
                            placeholder="Job URL"
                            value={form.jobUrl}
                            onChange={handleChange}
                        />

                        <input
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                        />

                        <input
                            name="salary"
                            placeholder="Salary"
                            value={form.salary}
                            onChange={handleChange}
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            {statuses.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            name="appliedDate"
                            value={form.appliedDate}
                            onChange={handleChange}
                        />

                    </div>

                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={form.notes}
                        onChange={handleChange}
                    />

                    <div className="form-actions">

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Save Application"}
                        </button>

                    </div>
                </form>
            )}

            <div className="applications-list">

                {jobs.length === 0 ? (
                    <div className="empty-applications">
                        <h2>No applications yet</h2>

                        <p>
                            Start tracking your next career opportunity.
                        </p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div
                            className="application-card"
                            key={job._id}
                        >
                            <div className="job-info">

                                <div className="company-icon">
                                    {job.company
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h2>{job.jobTitle}</h2>

                                    <p>{job.company}</p>

                                    <small>
                                        {job.location ||
                                            "Location not specified"}

                                        {job.salary &&
                                            ` • ${job.salary}`}
                                    </small>
                                </div>

                            </div>

                            <div className="job-actions">

                                <select
                                    value={job.status || "Applied"}
                                    onChange={(e) =>
                                        updateStatus(
                                            job._id,
                                            e.target.value
                                        )
                                    }
                                >
                                    {statuses.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                {job.jobUrl && (
                                    <a
                                        href={job.jobUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Job
                                    </a>
                                )}

                                <button
                                    className="delete-job"
                                    onClick={() =>
                                        deleteJob(job._id)
                                    }
                                >
                                    ×
                                </button>

                            </div>
                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default Applications;