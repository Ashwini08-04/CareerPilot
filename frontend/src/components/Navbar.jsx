import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
    };

    const scrollToSection = (id) => {
        setMenuOpen(false);

        if (window.location.pathname !== "/") {
            navigate("/");

            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth"
                });
            }, 100);

            return;
        }

        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth"
        });
    };

    return (
        <nav className="navbar">

            <Link to="/" className="navbar-logo">
                <span className="logo-icon">
                    <Sparkles size={14} />
                </span>

                <span>Career<span>Pilot</span></span>
            </Link>

            <div className={`navbar-links ${menuOpen ? "open" : ""}`}>

                <button onClick={() => scrollToSection("features")}>
                    Features
                </button>

                <button onClick={() => scrollToSection("how-it-works")}>
                    How It Works
                </button>

                <button onClick={() => scrollToSection("ai-tools")}>
                    AI Tools
                </button>

                <button onClick={() => scrollToSection("career-insights")}>
                    Career Insights
                </button>

                <button onClick={() => scrollToSection("about")}>
                    About
                </button>

                <div className="mobile-actions">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="mobile-dashboard"
                                onClick={() => setMenuOpen(false)}
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="mobile-logout"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="mobile-login"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="mobile-start"
                                onClick={() => setMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

            </div>

            <div className="navbar-actions">

                {user ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="login-link"
                        >
                            Dashboard
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="get-started"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="login-link"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="get-started"
                        >
                            Get Started
                            <span>→</span>
                        </Link>
                    </>
                )}

            </div>

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation"
            >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

        </nav>
    );
}

export default Navbar;