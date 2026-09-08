// Reset password page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        token: "",
        newPassword: ""
    });

    const [message, setMessage] = useState("");
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

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://careerpilot-n4ys.onrender.com/api/auth/reset-password",
                form
            );

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Password reset failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="reset-password-page">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <div className="reset-password-icon">✦</div>

                    <span>CAREERPILOT</span>

                    <h1>Reset Password</h1>

                    <p>
                        Enter your reset token and create a new password.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>Reset Token</label>

                    <textarea
                        name="token"
                        placeholder="Paste your reset token"
                        value={form.token}
                        onChange={handleChange}
                        rows="4"
                        required
                    />

                    <label>New Password</label>

                    <input
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={form.newPassword}
                        onChange={handleChange}
                        minLength="6"
                        required
                    />

                    {error && (
                        <div className="reset-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="reset-success">
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Resetting..."
                            : "Reset Password →"}
                    </button>
                </form>

                <p className="login-text">
                    Remember your password?
                    <Link to="/login"> Login</Link>
                </p>
            </div>
        </section>
    );
}

export default ResetPassword;