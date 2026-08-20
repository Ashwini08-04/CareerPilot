import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/api";
import "./Jobs.css";

const initialForm = {
    company: "",
    jobTitle: "",
    jobUrl: "",
    location: "",
    salary: "",
    jobType: "",
    category: "",
    description: "",
    status: "Wishlist",
    appliedDate: "",
    notes: ""
};

const jobTypes = [
    "full_time",
    "part_time",
    "contract",
    "freelance"
];

const categories = [
    "Software Development",
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Data Science",
    "Data Analytics",
    "Machine Learning",
    "Artificial Intelligence",
    "DevOps",
    "Cloud Computing",
    "Cyber Security",
    "UI/UX Design",
    "Product Management",
    "QA / Testing",
    "Business Analyst",
    "Marketing",
    "Sales",
    "Writing",
    "Information Technology",
    "Other"
];

const statuses = [
    "Wishlist",
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Rejected"
];

const normalize = (value = "") =>
    String(value).trim().toLowerCase();

const formatJobType = (type = "") =>
    type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [allSearchResults, setAllSearchResults] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [form, setForm] = useState(initialForm);

    const [showForm, setShowForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [jobTypeFilter, setJobTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [remoteOnly, setRemoteOnly] = useState(false);

    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const [message, setMessage] = useState("");

    const [activeStatus, setActiveStatus] = useState("All");

    const fetchJobs = async () => {
        try {
            setLoading(true);

            const data = await apiRequest("/jobs");

            setJobs(data.jobs || []);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const stats = useMemo(() => {
        return {
            saved: jobs.length,

            applied: jobs.filter(
                (job) => normalize(job.status) === "applied"
            ).length,

            interviews: jobs.filter(
                (job) => normalize(job.status) === "interview"
            ).length,

            offers: jobs.filter(
                (job) => normalize(job.status) === "offer"
            ).length
        };
    }, [jobs]);

    const pipeline = useMemo(() => {
        return {
            Wishlist: jobs.filter(
                (job) => normalize(job.status) === "wishlist"
            ).length,

            Applied: jobs.filter(
                (job) => normalize(job.status) === "applied"
            ).length,

            Screening: jobs.filter(
                (job) => normalize(job.status) === "screening"
            ).length,

            Interview: jobs.filter(
                (job) => normalize(job.status) === "interview"
            ).length,

            Offer: jobs.filter(
                (job) => normalize(job.status) === "offer"
            ).length
        };
    }, [jobs]);

    const filteredTrackedJobs = useMemo(() => {
        if (activeStatus === "All") {
            return jobs;
        }

        return jobs.filter(
            (job) =>
                normalize(job.status) ===
                normalize(activeStatus)
        );
    }, [jobs, activeStatus]);

    const applyLocalFilters = (results) => {
        let filtered = [...results];

        if (jobTypeFilter) {
            filtered = filtered.filter(
                (job) =>
                    normalize(job.jobType) ===
                    normalize(jobTypeFilter)
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(
                (job) =>
                    normalize(job.category) ===
                    normalize(categoryFilter)
            );
        }

        if (remoteOnly) {
            filtered = filtered.filter((job) => {
                const text = normalize(
                    `${job.location || ""} ${job.description || ""}`
                );

                return (
                    text.includes("remote") ||
                    text.includes("worldwide") ||
                    text.includes("anywhere")
                );
            });
        }

        return filtered;
    };

    const searchJobs = async (newSearch = true) => {
        if (!searchQuery.trim()) {
            setMessage(
                "Describe the job you are looking for."
            );
            return;
        }

        try {
            setMessage("");

            if (newSearch) {
                setSearching(true);
            } else {
                setLoadingMore(true);
            }

            const nextPage = newSearch ? 1 : page + 1;

            const params = new URLSearchParams({
                query: searchQuery.trim(),
                page: nextPage,
                limit: 15
            });

            const data = await apiRequest(
                `/jobs/search?${params.toString()}`
            );

            const newJobs = data.jobs || [];

            if (newSearch) {
                setAllSearchResults(newJobs);
                setSearchResults(
                    applyLocalFilters(newJobs)
                );
                setPage(1);
            } else {
                const combined = [
                    ...allSearchResults,
                    ...newJobs
                ];

                setAllSearchResults(combined);
                setSearchResults(
                    applyLocalFilters(combined)
                );
                setPage(nextPage);
            }

            setHasMore(Boolean(data.hasMore));

            if (
                newSearch &&
                newJobs.length === 0
            ) {
                setMessage(
                    "No jobs found for this search."
                );
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setSearching(false);
            setLoadingMore(false);
        }
    };

    const applyFilters = () => {
        const filtered =
            applyLocalFilters(allSearchResults);

        setSearchResults(filtered);

        setMessage(
            filtered.length
                ? ""
                : "No jobs found for the selected filters."
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
        setJobTypeFilter("");
        setCategoryFilter("");
        setRemoteOnly(false);
        setAllSearchResults([]);
        setSearchResults([]);
        setPage(1);
        setHasMore(false);
        setMessage("");
    };

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const openForm = (job = null) => {
        if (job) {
            setEditingId(job._id);

            setForm({
                company: job.company || "",
                jobTitle: job.jobTitle || "",
                jobUrl: job.jobUrl || "",
                location: job.location || "",
                salary: job.salary || "",
                jobType: job.jobType || "",
                category: job.category || "",
                description: job.description || "",
                status: job.status || "Wishlist",
                appliedDate: job.appliedDate
                    ? job.appliedDate.split("T")[0]
                    : "",
                notes: job.notes || ""
            });
        } else {
            setEditingId(null);
            setForm(initialForm);
        }

        setMessage("");
        setShowForm(true);
    };

    const saveJob = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            if (editingId) {
                const data = await apiRequest(
                    `/jobs/${editingId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(form)
                    }
                );

                setJobs((prev) =>
                    prev.map((job) =>
                        job._id === editingId
                            ? data.job
                            : job
                    )
                );

                setMessage(
                    "Job updated successfully."
                );
            } else {
                const data = await apiRequest(
                    "/jobs",
                    {
                        method: "POST",
                        body: JSON.stringify(form)
                    }
                );

                setJobs((prev) => [
                    data.job,
                    ...prev
                ]);

                setMessage(
                    "Job added successfully."
                );
            }

            setForm(initialForm);
            setEditingId(null);
            setShowForm(false);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const saveExternalJob = async (job) => {
        if (job.saved) {
            setMessage(
                `Already saved as ${
                    job.trackerStatus || "Wishlist"
                }.`
            );
            return;
        }

        try {
            setMessage("");

            const data = await apiRequest(
                "/jobs/save",
                {
                    method: "POST",
                    body: JSON.stringify({
                        company: job.company,
                        jobTitle: job.jobTitle,
                        jobUrl: job.jobUrl,
                        location: job.location,
                        salary: job.salary,
                        jobType: job.jobType,
                        category: job.category,
                        description: job.description
                    })
                }
            );

            setJobs((prev) => [
                data.job,
                ...prev
            ]);

            const updateSearchJob = (item) =>
                item.jobUrl === job.jobUrl
                    ? {
                          ...item,
                          saved: true,
                          trackerId: data.job._id,
                          trackerStatus:
                              data.job.status
                      }
                    : item;

            setAllSearchResults((prev) =>
                prev.map(updateSearchJob)
            );

            setSearchResults((prev) =>
                prev.map(updateSearchJob)
            );

            setMessage(
                "Job saved to your tracker."
            );
        } catch (error) {
            if (
                error.status === 409 &&
                error.job
            ) {
                const updateExistingJob = (
                    item
                ) =>
                    item.jobUrl === job.jobUrl
                        ? {
                              ...item,
                              saved: true,
                              trackerId:
                                  error.job._id,
                              trackerStatus:
                                  error.job.status
                          }
                        : item;

                setAllSearchResults((prev) =>
                    prev.map(updateExistingJob)
                );

                setSearchResults((prev) =>
                    prev.map(updateExistingJob)
                );

                setMessage(
                    "Job already exists in your tracker."
                );
            } else {
                setMessage(error.message);
            }
        }
    };

    const deleteJob = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this job?"
            )
        ) {
            return;
        }

        try {
            await apiRequest(
                `/jobs/${id}`,
                {
                    method: "DELETE"
                }
            );

            setJobs((prev) =>
                prev.filter(
                    (job) => job._id !== id
                )
            );

            const updateDeletedJob = (job) =>
                job.trackerId === id
                    ? {
                          ...job,
                          saved: false,
                          trackerId: null,
                          trackerStatus: null
                      }
                    : job;

            setAllSearchResults((prev) =>
                prev.map(updateDeletedJob)
            );

            setSearchResults((prev) =>
                prev.map(updateDeletedJob)
            );

            setMessage(
                "Job deleted successfully."
            );
        } catch (error) {
            setMessage(error.message);
        }
    };

    const updateJobStatus = async (
        id,
        status
    ) => {
        try {
            const data = await apiRequest(
                `/jobs/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        status
                    })
                }
            );

            setJobs((prev) =>
                prev.map((job) =>
                    job._id === id
                        ? data.job
                        : job
                )
            );

            setMessage(
                `Job moved to ${status}.`
            );
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="jobs-page">

            <header className="jobs-header">
                <div>
                    <span>JOB TRACKER</span>

                    <h1>
                        Your career pipeline.
                    </h1>

                    <p>
                        Discover opportunities,
                        manage applications and
                        keep your career search
                        organized in one place.
                    </p>
                </div>

                <button
                    className="add-job-btn"
                    onClick={() => openForm()}
                >
                    + Add Job
                </button>
            </header>

            {message && (
                <p className="jobs-message">
                    {message}
                </p>
            )}

            <section className="job-stats">

                <div className="stat-card">
                    <span>Saved Jobs</span>
                    <strong>{stats.saved}</strong>
                    <small>
                        Opportunities saved
                    </small>
                </div>

                <div className="stat-card">
                    <span>Applications</span>
                    <strong>{stats.applied}</strong>
                    <small>
                        Applications submitted
                    </small>
                </div>

                <div className="stat-card">
                    <span>Interviews</span>
                    <strong>{stats.interviews}</strong>
                    <small>
                        Active interviews
                    </small>
                </div>

                <div className="stat-card stat-highlight">
                    <span>Offers</span>
                    <strong>{stats.offers}</strong>
                    <small>
                        Offers received
                    </small>
                </div>

            </section>

            <section className="job-pipeline">

                <div className="pipeline-heading">
                    <div>
                        <span>APPLICATION PIPELINE</span>
                        <h2>
                            Track your progress.
                        </h2>
                    </div>
                </div>

                <div className="pipeline-grid">

                    {Object.entries(pipeline).map(
                        ([status, count]) => (
                            <button
                                key={status}
                                className={`pipeline-item ${
                                    activeStatus ===
                                    status
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveStatus(
                                        status
                                    )
                                }
                            >
                                <strong>
                                    {count}
                                </strong>

                                <span>
                                    {status}
                                </span>
                            </button>
                        )
                    )}

                    <button
                        className={`pipeline-item ${
                            activeStatus === "All"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveStatus("All")
                        }
                    >
                        <strong>
                            {jobs.length}
                        </strong>

                        <span>
                            All Jobs
                        </span>
                    </button>

                </div>
            </section>

            <section className="job-search-card">

                <div className="job-search-heading">
                    <span>AI JOB SEARCH</span>

                    <h2>
                        Find your next opportunity.
                    </h2>

                    <p>
                        Describe the role you want
                        and let CareerPilot find
                        relevant opportunities.
                    </p>
                </div>

                <div className="job-search-form">

                    <input
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchJobs(true);
                            }
                        }}
                        placeholder="e.g. Fresher React developer jobs in Pune"
                    />

                    <button
                        onClick={() =>
                            searchJobs(true)
                        }
                        disabled={searching}
                    >
                        {searching
                            ? "Searching..."
                            : "Search Jobs"}
                    </button>

                </div>

                <div className="job-filters">

                    <select
                        value={jobTypeFilter}
                        onChange={(e) =>
                            setJobTypeFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            All Job Types
                        </option>

                        {jobTypes.map((type) => (
                            <option
                                key={type}
                                value={type}
                            >
                                {formatJobType(type)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            All Categories
                        </option>

                        {categories.map(
                            (category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            )
                        )}
                    </select>

                    <label className="remote-filter">
                        <input
                            type="checkbox"
                            checked={remoteOnly}
                            onChange={(e) =>
                                setRemoteOnly(
                                    e.target.checked
                                )
                            }
                        />

                        Remote only
                    </label>

                    <button
                        className="filter-btn"
                        onClick={applyFilters}
                    >
                        Apply Filters
                    </button>

                    <button
                        className="clear-filter-btn"
                        onClick={clearSearch}
                    >
                        Clear
                    </button>

                </div>
            </section>

            {searchResults.length > 0 && (
                <section className="search-results-section">

                    <div className="section-header">
                        <div>
                            <span>
                                SEARCH RESULTS
                            </span>

                            <h2>
                                {searchResults.length}{" "}
                                opportunities
                            </h2>
                        </div>
                    </div>

                    <div className="search-results-list">

                        {searchResults.map(
                            (job) => (
                                <div
                                    className="job-result-card"
                                    key={
                                        job.id ||
                                        job.jobUrl
                                    }
                                >

                                    <div className="job-result-main">

                                        <div className="job-company-icon">
                                            {job.company
                                                ?.charAt(
                                                    0
                                                )
                                                ?.toUpperCase() ||
                                                "J"}
                                        </div>

                                        <div className="job-result-info">

                                            <h3>
                                                {
                                                    job.jobTitle
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    job.company
                                                }
                                            </p>

                                            <div className="job-meta">

                                                <span>
                                                    📍{" "}
                                                    {job.location ||
                                                        "Remote"}
                                                </span>

                                                {job.salary && (
                                                    <span>
                                                        💰{" "}
                                                        {
                                                            job.salary
                                                        }
                                                    </span>
                                                )}

                                                {job.jobType && (
                                                    <span>
                                                        💼{" "}
                                                        {formatJobType(
                                                            job.jobType
                                                        )}
                                                    </span>
                                                )}

                                            </div>

                                            {job.category && (
                                                <span className="job-category">
                                                    {
                                                        job.category
                                                    }
                                                </span>
                                            )}

                                            {job.aiMatchScore >
                                                0 && (
                                                <span className="ai-match-score">
                                                    AI Match{" "}
                                                    {
                                                        job.aiMatchScore
                                                    }
                                                    %
                                                </span>
                                            )}

                                        </div>
                                    </div>

                                    <div className="job-result-actions">

                                        <button
                                            className="details-btn"
                                            onClick={() =>
                                                setSelectedJob(
                                                    job
                                                )
                                            }
                                        >
                                            View Details
                                        </button>

                                        {job.saved ? (
                                            <button
                                                className="saved-job-btn"
                                            >
                                                ✓{" "}
                                                {
                                                    job.trackerStatus ||
                                                    "Saved"
                                                }
                                            </button>
                                        ) : (
                                            <button
                                                className="save-job-btn"
                                                onClick={() =>
                                                    saveExternalJob(
                                                        job
                                                    )
                                                }
                                            >
                                                Save Job
                                            </button>
                                        )}

                                    </div>
                                </div>
                            )
                        )}

                    </div>

                    {hasMore && (
                        <div className="load-more-wrapper">

                            <button
                                className="load-more-btn"
                                onClick={() =>
                                    searchJobs(false)
                                }
                                disabled={
                                    loadingMore
                                }
                            >
                                {loadingMore
                                    ? "Loading..."
                                    : "Load More Jobs"}
                            </button>

                        </div>
                    )}

                </section>
            )}

            {selectedJob && (
                <div
                    className="job-modal-overlay"
                    onClick={() =>
                        setSelectedJob(null)
                    }
                >
                    <div
                        className="job-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="job-modal-close"
                            onClick={() =>
                                setSelectedJob(null)
                            }
                        >
                            ×
                        </button>

                        <span className="job-modal-label">
                            JOB DETAILS
                        </span>

                        <h2>
                            {
                                selectedJob.jobTitle
                            }
                        </h2>

                        <h3>
                            {selectedJob.company}
                        </h3>

                        <div className="job-modal-meta">

                            <span>
                                📍{" "}
                                {selectedJob.location ||
                                    "Remote"}
                            </span>

                            {selectedJob.salary && (
                                <span>
                                    💰{" "}
                                    {
                                        selectedJob.salary
                                    }
                                </span>
                            )}

                            {selectedJob.jobType && (
                                <span>
                                    💼{" "}
                                    {formatJobType(
                                        selectedJob.jobType
                                    )}
                                </span>
                            )}

                            {selectedJob.category && (
                                <span>
                                    🏷️{" "}
                                    {
                                        selectedJob.category
                                    }
                                </span>
                            )}

                        </div>

                        {selectedJob.aiMatchScore >
                            0 && (
                            <div className="ai-match-box">

                                <strong>
                                    AI Match:{" "}
                                    {
                                        selectedJob.aiMatchScore
                                    }
                                    %
                                </strong>

                                <p>
                                    {
                                        selectedJob.aiReason
                                    }
                                </p>

                            </div>
                        )}

                        {selectedJob.description && (
                            <div
                                className="job-description"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        selectedJob.description
                                }}
                            />
                        )}

                        <div className="job-modal-actions">

                            {selectedJob.jobUrl && (
                                <a
                                    href={
                                        selectedJob.jobUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="view-original-btn"
                                >
                                    View Original Job
                                </a>
                            )}

                            {selectedJob.saved ? (
                                <button className="saved-job-btn">
                                    ✓{" "}
                                    {
                                        selectedJob.trackerStatus
                                    }
                                </button>
                            ) : (
                                <button
                                    className="save-job-btn"
                                    onClick={async () => {
                                        await saveExternalJob(
                                            selectedJob
                                        );

                                        setSelectedJob(
                                            null
                                        );
                                    }}
                                >
                                    Save to Tracker
                                </button>
                            )}

                        </div>

                    </div>
                </div>
            )}

            {showForm && (
                <section className="job-form-card">

                    <div className="job-form-header">

                        <div>
                            <span>
                                {editingId
                                    ? "EDIT JOB"
                                    : "ADD JOB"}
                            </span>

                            <h2>
                                {editingId
                                    ? "Update your application."
                                    : "Add a new opportunity."}
                            </h2>
                        </div>

                        <button
                            className="job-form-close"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setForm(initialForm);
                            }}
                        >
                            ×
                        </button>

                    </div>

                    <form
                        className="job-form"
                        onSubmit={saveJob}
                    >

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Company
                                </label>

                                <input
                                    name="company"
                                    value={
                                        form.company
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Job Title
                                </label>

                                <input
                                    name="jobTitle"
                                    value={
                                        form.jobTitle
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={
                                        form.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Salary
                                </label>

                                <input
                                    name="salary"
                                    value={
                                        form.salary
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Job Type
                                </label>

                                <select
                                    name="jobType"
                                    value={
                                        form.jobType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select job type
                                    </option>

                                    {jobTypes.map(
                                        (type) => (
                                            <option
                                                key={type}
                                                value={type}
                                            >
                                                {formatJobType(
                                                    type
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        form.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >
                                                {category}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    {statuses.map(
                                        (status) => (
                                            <option
                                                key={
                                                    status
                                                }
                                                value={
                                                    status
                                                }
                                            >
                                                {status}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Applied Date
                                </label>

                                <input
                                    type="date"
                                    name="appliedDate"
                                    value={
                                        form.appliedDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label>
                                Job URL
                            </label>

                            <input
                                name="jobUrl"
                                value={
                                    form.jobUrl
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Personal Notes
                            </label>

                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={
                                    handleChange
                                }
                                placeholder="Add your notes about this opportunity..."
                            />
                        </div>

                        <div className="job-form-actions">

                            <button
                                type="button"
                                className="cancel-job-btn"
                                onClick={() => {
                                    setShowForm(
                                        false
                                    );
                                    setEditingId(null);
                                    setForm(
                                        initialForm
                                    );
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-job-form-btn"
                            >
                                {editingId
                                    ? "Update Job"
                                    : "Add Job"}
                            </button>

                        </div>

                    </form>

                </section>
            )}

            <section className="jobs-card">

                <div className="jobs-card-header">

                    <div>
                        <span>
                            MY APPLICATIONS
                        </span>

                        <h2>
                            {activeStatus === "All"
                                ? "Your Applications"
                                : `${activeStatus} Jobs`}
                        </h2>
                    </div>

                    <strong>
                        {
                            filteredTrackedJobs.length
                        }
                    </strong>

                </div>

                {loading ? (
                    <div className="jobs-empty">
                        <h3>
                            Loading your jobs...
                        </h3>
                    </div>
                ) : filteredTrackedJobs.length ===
                  0 ? (
                    <div className="jobs-empty">

                        <h3>
                            No jobs tracked yet
                        </h3>

                        <p>
                            Search for jobs and save
                            the opportunities you want
                            to pursue.
                        </p>

                        <button
                            className="add-job-btn"
                            onClick={() =>
                                openForm()
                            }
                        >
                            + Add Job
                        </button>

                    </div>
                ) : (
                    <div className="jobs-list">

                        {filteredTrackedJobs.map(
                            (job) => (
                                <div
                                    className="job-item"
                                    key={job._id}
                                >

                                    <div className="job-info">

                                        <h3>
                                            {
                                                job.jobTitle
                                            }
                                        </h3>

                                        <p>
                                            {
                                                job.company
                                            }
                                        </p>

                                        <span>
                                            📍{" "}
                                            {job.location ||
                                                "Location not specified"}
                                        </span>

                                    </div>

                                    <div className="job-actions">

                                        <select
                                            className="job-status-select"
                                            value={
                                                job.status
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateJobStatus(
                                                    job._id,
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        >
                                            {statuses.map(
                                                (
                                                    status
                                                ) => (
                                                    <option
                                                        key={
                                                            status
                                                        }
                                                        value={
                                                            status
                                                        }
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <button
                                            onClick={() =>
                                                openForm(
                                                    job
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteJob(
                                                    job._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Jobs;