// CareerPilot final call-to-action
import {
    ArrowRight,
    FileText,
    Map,
    Search,
    Sparkles,
    Video
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CTA.css";

const highlights = [
    {
        icon: FileText,
        text: "Build your resume"
    },
    {
        icon: Map,
        text: "Plan your career"
    },
    {
        icon: Video,
        text: "Practice interviews"
    },
    {
        icon: Search,
        text: "Find better jobs"
    }
];

function CTA() {
    const { user } = useAuth();

    return (
        <section className="cta">

            <div className="cta-content">

                <div className="cta-badge">
                    <Sparkles size={14} />
                    YOUR NEXT MOVE STARTS HERE
                </div>

                <h2>
                    Ready to take your
                    <span>next career step?</span>
                </h2>

                <p>
                    Build your resume, discover your career path, prepare
                    for interviews and find opportunities — all in one place.
                </p>

                <div className="cta-highlights">
                    {highlights.map(({ icon: Icon, text }) => (
                        <div className="cta-highlight" key={text}>
                            <Icon size={13} />
                            <span>{text}</span>
                        </div>
                    ))}
                </div>

                <Link
                    to={user ? "/dashboard" : "/register"}
                    className="cta-button"
                >
                    {user ? "Go to Dashboard" : "Start My Career Journey"}
                    <ArrowRight size={16} />
                </Link>

                <small>
                    Free to get started · Your data stays private
                </small>

            </div>

        </section>
    );
}

export default CTA;