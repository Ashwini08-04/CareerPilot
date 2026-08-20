// Login page
// Login page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                form
            );

            login(
                response.data.user,
                response.data.token
            );

            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">✦</div>

                    <span>CAREERPILOT</span>

                    <h1>Welcome back</h1>

                    <p>
                        Continue your career journey with CareerPilot.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>Email address</label>

                    <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>

                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="forgot-link">
                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Signing in..."
                            : "Sign In →"}
                    </button>
                </form>

                <p className="register-text">
                    Don't have an account?
                    <Link to="/register"> Create one</Link>
                </p>
            </div>
        </section>
    );
}

export default Login;