// CareerPilot feature showcase
import {
    ArrowRight,
    FileText,
    Map,
    MessageSquare,
    Search,
    Sparkles
} from "lucide-react";
import "./Features.css";

function Features() {
    return (
        <section className="features" id="features">

            <div className="features-heading">
                <span>CAREER INTELLIGENCE</span>

                <h2>
                    Everything you need
                    <strong>to move forward.</strong>
                </h2>

                <p>
                    One intelligent workspace for every stage of your career.
                </p>
            </div>

            {/* Resume Builder */}
            <div className="resume-showcase">

                <div className="showcase-content">

                    <div className="feature-icon">
                        <FileText size={18} />
                    </div>

                    <small>01 — RESUME BUILDER</small>

                    <h3>
                        Build a resume
                        <strong>that gets noticed.</strong>
                    </h3>

                    <p>
                        Create a professional, ATS-friendly resume with
                        structured sections for your experience, skills,
                        education and projects.
                    </p>

                    <button>
                        Build your resume
                        <ArrowRight size={14} />
                    </button>

                </div>

                <div className="resume-ui">

                    <div className="resume-ui-top">

                        <div>
                            <small>Resume Builder</small>
                            <strong>Professional Resume</strong>
                        </div>

                        <div className="resume-score">
                            <b>91</b>
                            <span>/100 ATS</span>
                        </div>

                    </div>

                    <div className="resume-ui-body">

                        <div className="resume-document">

                            <div className="document-title" />
                            <div className="document-line long" />
                            <div className="document-line" />

                            <label>Experience</label>

                            <div className="document-line long" />
                            <div className="document-line medium" />

                            <label>Education</label>

                            <div className="document-line long" />
                            <div className="document-line medium" />

                            <label>Skills</label>

                            <div className="document-tags">
                                <span>React</span>
                                <span>Node.js</span>
                                <span>MongoDB</span>
                                <span>JavaScript</span>
                            </div>

                        </div>

                        <div className="ai-analysis">

                            <div className="analysis-title">
                                <Sparkles size={13} />
                                AI Resume Check
                            </div>

                            <div className="analysis-item positive">
                                <i>✓</i>
                                ATS-friendly structure
                            </div>

                            <div className="analysis-item positive">
                                <i>✓</i>
                                Strong project section
                            </div>

                            <div className="analysis-item positive">
                                <i>✓</i>
                                Skills clearly matched
                            </div>

                            <div className="analysis-item warning">
                                <i>!</i>
                                Improve TypeScript
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Feature Modules */}
            <div className="feature-modules">

                {/* Career Roadmap */}
                <div className="module">

                    <div className="module-icon purple">
                        <Map size={17} />
                    </div>

                    <small>02 — AI CAREER ROADMAP</small>

                    <h3>Know exactly what to learn next.</h3>

                    <p>
                        Choose your target role and let AI analyze your
                        current skills to create a personalized career path.
                    </p>

                    <div className="roadmap-ui">

                        <div className="roadmap-step active">
                            <span>01</span>
                            <div>
                                <b>Current Skills</b>
                                <small>React · JavaScript</small>
                            </div>
                        </div>

                        <div className="roadmap-line" />

                        <div className="roadmap-step">
                            <span>02</span>
                            <div>
                                <b>Skill Gaps</b>
                                <small>TypeScript · Testing</small>
                            </div>
                        </div>

                        <div className="roadmap-line" />

                        <div className="roadmap-step">
                            <span>03</span>
                            <div>
                                <b>Target Role</b>
                                <small>Frontend Developer</small>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Interview Simulator */}
                <div className="module">

                    <div className="module-icon orange">
                        <MessageSquare size={17} />
                    </div>

                    <small>03 — AI INTERVIEW SIMULATOR</small>

                    <h3>Practice interviews with AI.</h3>

                    <p>
                        Simulate realistic interviews for your target role
                        and receive instant feedback on every answer.
                    </p>

                    <div className="interview-ui">

                        <div className="question">

                            <span>AI Interviewer</span>

                            <p>
                                Tell me about a challenging project
                                you worked on.
                            </p>

                        </div>

                        <div className="interview-answer">
                            <span>Your answer</span>
                            <div className="answer-lines">
                                <i />
                                <i />
                                <i />
                            </div>
                        </div>

                        <div className="interview-status">
                            <span>Practice session</span>
                            <b>● Live</b>
                        </div>

                    </div>

                </div>

                {/* Job Search */}
                <div className="module">

                    <div className="module-icon blue">
                        <Search size={17} />
                    </div>

                    <small>04 — JOB SEARCH</small>

                    <h3>Find jobs that fit your profile.</h3>

                    <p>
                        Search opportunities by role and location, filter
                        results and save interesting jobs to your tracker.
                    </p>

                    <div className="job-ui">

                        <div className="job-header">
                            <span>Frontend Developer</span>
                            <b>89%</b>
                        </div>

                        <div className="match-bar">
                            <i />
                        </div>

                        <div className="job-details">
                            <span>React · Node.js</span>
                            <span>Pune · Remote</span>
                        </div>

                        <div className="job-actions">
                            <span>Full-time</span>
                            <strong>Save Job</strong>
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Features;