// CareerPilot footer
import {
    ArrowUpRight,
    FileText,
    Map,
    Search,
    Sparkles,
    Video
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const tools = [
    {
        icon: FileText,
        text: "Resume Builder"
    },
    {
        icon: Map,
        text: "AI Career Roadmap"
    },
    {
        icon: Video,
        text: "AI Interview Simulator"
    },
    {
        icon: Search,
        text: "Job Search"
    }
];

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-main">

                <div className="footer-brand">

                    <Link to="/" className="footer-logo">
                        <span>
                            <Sparkles size={15} />
                        </span>
                        CareerPilot
                    </Link>

                    <p>
                        Your AI-powered workspace for smarter career
                        decisions and your next career move.
                    </p>

                    <a href="#hero" className="back-top">
                        Back to top
                        <ArrowUpRight size={14} />
                    </a>

                </div>

                <div className="footer-column">

                    <h4>Platform</h4>

                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#career-insights">Career Insights</a>
                    <a href="#about">About CareerPilot</a>

                </div>

                <div className="footer-column">

                    <h4>AI Tools</h4>

                    {tools.map(({ icon: Icon, text }) => (
                        <Link to="/dashboard" key={text}>
                            <Icon size={12} />
                            {text}
                        </Link>
                    ))}

                </div>

                <div className="footer-column">

                    <h4>Get Started</h4>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Create Account
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                </div>

            </div>

            <div className="footer-bottom">

                <span>
                    © 2026 CareerPilot. All rights reserved.
                </span>

                <span>
                    Built for your next career move.
                </span>

            </div>

        </footer>
    );
}

export default Footer;