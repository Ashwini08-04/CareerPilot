// Register page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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
            await axios.post(
                "http://localhost:5000/api/auth/register",
                form
            );

            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <div className="register-icon">✦</div>

                    <span>CAREERPILOT</span>

                    <h1>Create your account</h1>

                    <p>
                        Start building a smarter path for your career.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>Full name</label>

                    <input
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

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
                        placeholder="Create a password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account →"}
                    </button>
                </form>

                <p className="login-text">
                    Already have an account?
                    <Link to="/login"> Sign in</Link>
                </p>
            </div>
        </section>
    );
}

export default Register;