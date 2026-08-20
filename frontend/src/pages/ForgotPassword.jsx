import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setResetToken("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            setMessage(data.message);
            setResetToken(data.resetToken);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password">
            <h2>Forgot Password</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Generating..." : "Reset Password"}
                </button>
            </form>

            {message && <p>{message}</p>}

            {resetToken && (
                <div>
                    <p>Your reset token:</p>

                    <textarea
                        value={resetToken}
                        readOnly
                        rows="4"
                    />

                    <p>
                        Copy this token for the reset password step.
                    </p>

                    <Link to="/reset-password">
                        Continue to Reset Password →
                    </Link>
                </div>
            )}

            <p>
                Remember your password?
                <Link to="/login"> Login</Link>
            </p>
        </div>
    );
};

export default ForgotPassword;