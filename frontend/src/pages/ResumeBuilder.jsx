import { useEffect, useState } from "react";
import "./ResumeBuilder.css";
import html2pdf from "html2pdf.js";
import axios from "axios";

const API_URL = "http://localhost:5000/api/resume-builder";

function ResumeBuilder() {
    const [template, setTemplate] = useState("classic");
    const [resumeId, setResumeId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [resume, setResume] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        summary: "",
        skills: ""
    });

    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const getConfig = () => ({
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    useEffect(() => {
        loadResume();
    }, []);

    const loadResume = async () => {
        try {
            const response = await axios.get(API_URL, getConfig());
            const data = response.data.resume;

            setResumeId(data._id);
            setTemplate(data.template || "classic");

            setResume({
                fullName: data.fullName || "",
                email: data.email || "",
                phone: data.phone || "",
                location: data.location || "",
                linkedin: data.linkedin || "",
                github: data.github || "",
                summary: data.summary || "",
                skills: data.skills || ""
            });

            setExperience(data.experience || []);
            setEducation(data.education || []);
            setProjects(data.projects || []);
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error("Failed to load resume:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setResume((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const addExperience = () => {
        setExperience([
            ...experience,
            {
                jobTitle: "",
                company: "",
                duration: "",
                description: ""
            }
        ]);
    };

    const updateExperience = (index, field, value) => {
        const updated = [...experience];
        updated[index][field] = value;
        setExperience(updated);
    };

    const removeExperience = (index) => {
        setExperience(experience.filter((_, i) => i !== index));
    };

    const addEducation = () => {
        setEducation([
            ...education,
            {
                degree: "",
                college: "",
                duration: "",
                location: ""
            }
        ]);
    };

    const updateEducation = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    const removeEducation = (index) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    const addProject = () => {
        setProjects([
            ...projects,
            {
                name: "",
                technologies: "",
                description: ""
            }
        ]);
    };

    const updateProject = (index, field, value) => {
        const updated = [...projects];
        updated[index][field] = value;
        setProjects(updated);
    };

    const removeProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    const getResumeData = () => ({
        template,
        ...resume,
        experience,
        education,
        projects
    });

    const saveResume = async () => {
        setSaving(true);
        setMessage("");

        try {
            const data = getResumeData();

            if (resumeId) {
                const response = await axios.put(
                    API_URL,
                    data,
                    getConfig()
                );

                setResumeId(response.data.resume._id);
                setMessage("Resume updated successfully.");
            } else {
                const response = await axios.post(
                    API_URL,
                    data,
                    getConfig()
                );

                setResumeId(response.data.resume._id);
                setMessage("Resume saved successfully.");
            }
        } catch (error) {
            console.error("Save Resume Error:", error);
            setMessage(
                error.response?.data?.message || "Failed to save resume."
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteResume = async () => {
        if (!resumeId) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${API_URL}/${resumeId}`,
                getConfig()
            );

            setResumeId(null);

            setResume({
                fullName: "",
                email: "",
                phone: "",
                location: "",
                linkedin: "",
                github: "",
                summary: "",
                skills: ""
            });

            setExperience([]);
            setEducation([]);
            setProjects([]);
            setTemplate("classic");

            setMessage("Resume deleted successfully.");
        } catch (error) {
            console.error("Delete Resume Error:", error);
            setMessage(
                error.response?.data?.message || "Failed to delete resume."
            );
        }
    };

    const handlePrint = () => {
        const element = document.querySelector(".resume-paper");

        const options = {
            margin: 0,
            filename: `${resume.fullName || "resume"}.pdf`,
            image: {
                type: "jpeg",
                quality: 0.98
            },
            html2canvas: {
                scale: 2,
                useCORS: true
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        };

        html2pdf().set(options).from(element).save();
    };

    if (loading) {
        return (
            <div className="resume-builder-loading">
                Loading your resume...
            </div>
        );
    }

    return (
        <div className="resume-builder">

            <div className="builder-header">
                <span>RESUME BUILDER</span>
                <h1>Build your professional resume.</h1>
                <p>
                    Create, edit and download your resume in real time.
                </p>
            </div>

            <div className="builder-toolbar">

                <div className="template-selector">
                    <span>RESUME TEMPLATE</span>

                    <div className="template-options">
                        {["classic", "modern", "minimal"].map((item) => (
                            <button
                                key={item}
                                type="button"
                                className={
                                    template === item ? "active" : ""
                                }
                                onClick={() => setTemplate(item)}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="resume-actions">
                    <button
                        type="button"
                        className="save-resume-button"
                        onClick={saveResume}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : resumeId
                                ? "Update Resume"
                                : "Save Resume"}
                    </button>

                    {resumeId && (
                        <button
                            type="button"
                            className="delete-resume-button"
                            onClick={deleteResume}
                        >
                            Delete
                        </button>
                    )}

                    <button
                        type="button"
                        className="download-pdf-button"
                        onClick={handlePrint}
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            {message && (
                <div className="resume-message">
                    {message}
                </div>
            )}

            <div className="builder-layout">

                <div className="builder-form">

                    <h2>Personal Details</h2>

                    <input
                        name="fullName"
                        placeholder="Full Name"
                        value={resume.fullName}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        value={resume.email}
                        onChange={handleChange}
                    />

                    <input
                        name="phone"
                        placeholder="Phone"
                        value={resume.phone}
                        onChange={handleChange}
                    />

                    <input
                        name="location"
                        placeholder="Location"
                        value={resume.location}
                        onChange={handleChange}
                    />

                    <input
                        name="linkedin"
                        placeholder="LinkedIn URL"
                        value={resume.linkedin}
                        onChange={handleChange}
                    />

                    <input
                        name="github"
                        placeholder="GitHub URL"
                        value={resume.github}
                        onChange={handleChange}
                    />

                    <h2>Professional Summary</h2>

                    <textarea
                        name="summary"
                        placeholder="Write your professional summary..."
                        value={resume.summary}
                        onChange={handleChange}
                    />

                    <h2>Skills</h2>

                    <textarea
                        name="skills"
                        placeholder="JavaScript, React.js, Node.js..."
                        value={resume.skills}
                        onChange={handleChange}
                    />

                    <div className="builder-section-heading">
                        <h2>Experience</h2>
                        <button type="button" onClick={addExperience}>
                            + Add
                        </button>
                    </div>

                    {experience.map((item, index) => (
                        <div className="dynamic-form-card" key={index}>

                            <button
                                type="button"
                                className="remove-button"
                                onClick={() => removeExperience(index)}
                            >
                                ×
                            </button>

                            <input
                                placeholder="Job Title"
                                value={item.jobTitle}
                                onChange={(e) =>
                                    updateExperience(
                                        index,
                                        "jobTitle",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="Company"
                                value={item.company}
                                onChange={(e) =>
                                    updateExperience(
                                        index,
                                        "company",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="Duration"
                                value={item.duration}
                                onChange={(e) =>
                                    updateExperience(
                                        index,
                                        "duration",
                                        e.target.value
                                    )
                                }
                            />

                            <textarea
                                placeholder="Responsibilities / Description"
                                value={item.description}
                                onChange={(e) =>
                                    updateExperience(
                                        index,
                                        "description",
                                        e.target.value
                                    )
                                }
                            />

                        </div>
                    ))}

                    <div className="builder-section-heading">
                        <h2>Education</h2>
                        <button type="button" onClick={addEducation}>
                            + Add
                        </button>
                    </div>

                    {education.map((item, index) => (
                        <div className="dynamic-form-card" key={index}>

                            <button
                                type="button"
                                className="remove-button"
                                onClick={() => removeEducation(index)}
                            >
                                ×
                            </button>

                            <input
                                placeholder="Degree"
                                value={item.degree}
                                onChange={(e) =>
                                    updateEducation(
                                        index,
                                        "degree",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="College / University"
                                value={item.college}
                                onChange={(e) =>
                                    updateEducation(
                                        index,
                                        "college",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="Duration"
                                value={item.duration}
                                onChange={(e) =>
                                    updateEducation(
                                        index,
                                        "duration",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="Location"
                                value={item.location}
                                onChange={(e) =>
                                    updateEducation(
                                        index,
                                        "location",
                                        e.target.value
                                    )
                                }
                            />

                        </div>
                    ))}

                    <div className="builder-section-heading">
                        <h2>Projects</h2>
                        <button type="button" onClick={addProject}>
                            + Add
                        </button>
                    </div>

                    {projects.map((item, index) => (
                        <div className="dynamic-form-card" key={index}>

                            <button
                                type="button"
                                className="remove-button"
                                onClick={() => removeProject(index)}
                            >
                                ×
                            </button>

                            <input
                                placeholder="Project Name"
                                value={item.name}
                                onChange={(e) =>
                                    updateProject(
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="Technologies"
                                value={item.technologies}
                                onChange={(e) =>
                                    updateProject(
                                        index,
                                        "technologies",
                                        e.target.value
                                    )
                                }
                            />

                            <textarea
                                placeholder="Project Description"
                                value={item.description}
                                onChange={(e) =>
                                    updateProject(
                                        index,
                                        "description",
                                        e.target.value
                                    )
                                }
                            />

                        </div>
                    ))}

                </div>

                <div className="resume-preview">

                    <div className={`resume-paper ${template}-template`}>

                        <header className="preview-header">
                            <h1>
                                {resume.fullName || "Your Name"}
                            </h1>

                            <p>
                                {resume.email || "email@example.com"}
                                {resume.phone && ` • ${resume.phone}`}
                                {resume.location && ` • ${resume.location}`}
                            </p>

                            {(resume.linkedin || resume.github) && (
                                <p>
                                    {resume.linkedin}

                                    {resume.linkedin &&
                                        resume.github &&
                                        " • "}

                                    {resume.github}
                                </p>
                            )}
                        </header>

                        {resume.summary && (
                            <section>
                                <h2>PROFESSIONAL SUMMARY</h2>
                                <p>{resume.summary}</p>
                            </section>
                        )}

                        {resume.skills && (
                            <section>
                                <h2>SKILLS</h2>
                                <p>{resume.skills}</p>
                            </section>
                        )}

                        {experience.length > 0 && (
                            <section>
                                <h2>EXPERIENCE</h2>

                                {experience.map((item, index) => (
                                    <div
                                        className="preview-entry"
                                        key={index}
                                    >
                                        <strong>{item.jobTitle}</strong>

                                        <span>
                                            {item.company}
                                            {item.duration &&
                                                ` • ${item.duration}`}
                                        </span>

                                        {item.description && (
                                            <p>{item.description}</p>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                        {education.length > 0 && (
                            <section>
                                <h2>EDUCATION</h2>

                                {education.map((item, index) => (
                                    <div
                                        className="preview-entry"
                                        key={index}
                                    >
                                        <strong>{item.degree}</strong>

                                        <span>
                                            {item.college}
                                            {item.duration &&
                                                ` • ${item.duration}`}
                                        </span>

                                        {item.location && (
                                            <p>{item.location}</p>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                        {projects.length > 0 && (
                            <section>
                                <h2>PROJECTS</h2>

                                {projects.map((item, index) => (
                                    <div
                                        className="preview-entry"
                                        key={index}
                                    >
                                        <strong>{item.name}</strong>

                                        {item.technologies && (
                                            <span>
                                                {item.technologies}
                                            </span>
                                        )}

                                        {item.description && (
                                            <p>{item.description}</p>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ResumeBuilder;