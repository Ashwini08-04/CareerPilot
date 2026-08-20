// CareerPilot career insights
import {
    ArrowRight,
    Briefcase,
    FileText,
    Sparkles,
    Target
} from "lucide-react";
import { Link } from "react-router-dom";
import "./CareerInsights.css";

const insights = [
    {
        icon: FileText,
        label: "RESUME",
        title: "Resume strength",
        text: "Understand how strong your profile looks to employers.",
        value: "91%",
        progress: "91%"
    },
    {
        icon: Target,
        label: "SKILLS",
        title: "Skill readiness",
        text: "Identify the skills that can improve your target-role fit.",
        value: "84%",
        progress: "84%"
    },
    {
        icon: Briefcase,
        label: "APPLICATIONS",
        title: "Job progress",
        text: "See your applications, interviews and opportunities at a glance.",
        value: "24",
        progress: "72%"
    }
];

function CareerInsights() {
    return (
        <section id="career-insights" className="career-insights">

            <div className="insights-header">
                <span>CAREER INSIGHTS</span>

                <h2>
                    See where your career
                    <strong> stands.</strong>
                </h2>

                <p>
                    CareerPilot turns your career data into clear,
                    actionable direction.
                </p>
            </div>

            <div className="insights-grid">
                {insights.map(
                    ({
                        icon: Icon,
                        label,
                        title,
                        text,
                        value,
                        progress
                    }) => (
                        <div className="insight-box" key={label}>

                            <div className="insight-top">
                                <div className="insight-icon">
                                    <Icon size={18} />
                                </div>

                                <strong>{value}</strong>
                            </div>

                            <span>{label}</span>

                            <h3>{title}</h3>

                            <p>{text}</p>

                            <div className="insight-progress">
                                <div
                                    className="insight-progress-fill"
                                    style={{ width: progress }}
                                />
                            </div>

                            <div className="insight-progress-label">
                                <span>Profile progress</span>
                                <b>{progress}</b>
                            </div>

                        </div>
                    )
                )}
            </div>

            <div className="insights-bottom">

                <div className="direction">

                    <div className="direction-icon">
                        <Sparkles size={17} />
                    </div>

                    <div>
                        <span>AI-POWERED DIRECTION</span>

                        <h3>
                            Your data becomes your career strategy.
                        </h3>
                    </div>

                </div>

                <Link to="/dashboard">
                    Explore CareerPilot
                    <ArrowRight size={15} />
                </Link>

            </div>

        </section>
    );
}

export default CareerInsights;