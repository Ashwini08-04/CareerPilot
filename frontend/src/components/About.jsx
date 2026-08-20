// CareerPilot about section
import {
    ArrowRight,
    BrainCircuit,
    FileText,
    LockKeyhole,
    Map,
    Search,
    Sparkles,
    Target,
    Video
} from "lucide-react";
import { Link } from "react-router-dom";
import "./About.css";

const capabilities = [
    {
        icon: FileText,
        title: "Resume Builder",
        text: "Create an ATS-friendly resume with your education, skills, experience and projects."
    },
    {
        icon: Map,
        title: "AI Career Roadmap",
        text: "Discover missing skills and get a personalized path from beginner to advanced."
    },
    {
        icon: Video,
        title: "AI Interview Simulator",
        text: "Practice realistic interviews and receive instant AI feedback on your answers."
    },
    {
        icon: Search,
        title: "Job Search Integration",
        text: "Find relevant opportunities, explore job details and save interesting roles."
    }
];

function About() {
    return (
        <section id="about" className="about-section">

            <div className="about-header">
                <span>ABOUT CAREERPILOT</span>

                <h2>
                    One workspace for your
                    <strong> entire career journey.</strong>
                </h2>

                <p>
                    From building your resume to finding jobs and preparing
                    for interviews, CareerPilot keeps your entire career
                    journey connected.
                </p>
            </div>

            <div className="about-grid">

                <div className="about-main-card">
                    <div className="about-card-icon">
                        <Target size={20} />
                    </div>

                    <span>OUR PURPOSE</span>

                    <h3>
                        A smarter way to manage
                        your career.
                    </h3>

                    <p>
                        Build your profile, understand skill gaps, discover
                        opportunities and prepare for your next career move
                        from one intelligent workspace.
                    </p>
                </div>

                <div className="about-side-card">
                    <Sparkles size={20} />

                    <h3>AI built into your workflow.</h3>

                    <p>
                        Get intelligent guidance through resume analysis,
                        career roadmaps, job matching and interview practice.
                    </p>
                </div>

                <div className="about-side-card">
                    <LockKeyhole size={20} />

                    <h3>Private and secure.</h3>

                    <p>
                        Your career workspace is protected with secure
                        authentication and protected routes.
                    </p>
                </div>

            </div>

            <div className="capabilities-heading">
                <span>CAREERPILOT CAPABILITIES</span>

                <h3>
                    Everything connected in
                    <strong> one career workspace.</strong>
                </h3>
            </div>

            <div className="capabilities-grid">
                {capabilities.map(({ icon: Icon, title, text }) => (
                    <div className="capability-card" key={title}>
                        <div className="capability-icon">
                            <Icon size={17} />
                        </div>

                        <h4>{title}</h4>

                        <p>{text}</p>
                    </div>
                ))}
            </div>

            <div className="about-bottom">

                <div>
                    <span>READY TO MOVE FORWARD?</span>
                    <h3>Build your smarter career strategy.</h3>
                </div>

                <Link to="/register">
                    Get Started
                    <ArrowRight size={16} />
                </Link>

            </div>

        </section>
    );
}

export default About;