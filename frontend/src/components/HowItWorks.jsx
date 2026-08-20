// CareerPilot workflow section
import {
    FileText,
    Sparkles,
    Search,
    TrendingUp
} from "lucide-react";

import "./HowItWorks.css";

const steps = [
    {
        number: "01",
        icon: FileText,
        title: "Build Your Profile",
        text: "Create your professional profile with your resume, skills, education, experience and projects."
    },
    {
        number: "02",
        icon: Sparkles,
        title: "Get AI Guidance",
        text: "Let AI analyze your profile, identify skill gaps and create a personalized career roadmap."
    },
    {
        number: "03",
        icon: Search,
        title: "Find & Prepare",
        text: "Discover relevant jobs, save opportunities and practice realistic interviews with your AI coach."
    },
    {
        number: "04",
        icon: TrendingUp,
        title: "Track & Grow",
        text: "Track applications, improve your skills and follow your progress toward your target career."
    }
];

function HowItWorks() {
    return (
        <section className="how-section" id="how-it-works">

            <div className="how-heading">

                <span>HOW IT WORKS</span>

                <h2>
                    Your career journey,
                    <strong> simplified.</strong>
                </h2>

                <p>
                    From building your profile to landing your next
                    opportunity, CareerPilot keeps your entire career journey
                    connected.
                </p>

            </div>

            <div className="steps">

                {steps.map(({ number, icon: Icon, title, text }, index) => (

                    <div className="step-wrapper" key={number}>

                        <div className="step-card">

                            <div className="step-top">

                                <span>{number}</span>

                                <div className="step-icon">
                                    <Icon size={19} />
                                </div>

                            </div>

                            <h3>{title}</h3>

                            <p>{text}</p>

                            <div className="step-status">
                                <i />
                                CareerPilot step
                            </div>

                        </div>

                        {index < steps.length - 1 && (
                            <div className="step-line" />
                        )}

                    </div>

                ))}

            </div>

        </section>
    );
}

export default HowItWorks;