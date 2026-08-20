import { useEffect, useState } from "react";
import "./Analytics.css";

const API_URL = "http://localhost:5000/api/jobs/analytics";

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    // Fetch application analytics
    const fetchAnalytics = async () => {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load analytics"
                );
            }

            setAnalytics(data.analytics);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="analytics-page">
                <p>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="analytics-page">

            <header className="analytics-header">
                <span>CAREER ANALYTICS</span>

                <h1>Application Analytics</h1>

                <p>
                    Track your job search progress and
                    application performance.
                </p>
            </header>

            {message && (
                <p className="analytics-message">
                    {message}
                </p>
            )}

            {analytics && (
                <>
                    <section className="analytics-cards">

                        <div className="analytics-card">
                            <span>Total Applications</span>
                            <strong>{analytics.totalJobs}</strong>
                        </div>

                        <div className="analytics-card">
                            <span>Applied</span>
                            <strong>{analytics.Applied}</strong>
                        </div>

                        <div className="analytics-card">
                            <span>Screening</span>
                            <strong>{analytics.Screening}</strong>
                        </div>

                        <div className="analytics-card">
                            <span>Interviews</span>
                            <strong>{analytics.Interview}</strong>
                        </div>

                        <div className="analytics-card">
                            <span>Offers</span>
                            <strong>{analytics.Offer}</strong>
                        </div>

                        <div className="analytics-card">
                            <span>Rejected</span>
                            <strong>{analytics.Rejected}</strong>
                        </div>

                    </section>

                    <section className="analytics-overview">

                        <div>
                            <span>APPLICATION OVERVIEW</span>

                            <h2>Your job search status</h2>
                        </div>

                        <div className="status-list">

                            <div>
                                <span>Wishlist</span>
                                <strong>
                                    {analytics.Wishlist}
                                </strong>
                            </div>

                            <div>
                                <span>Applied</span>
                                <strong>
                                    {analytics.Applied}
                                </strong>
                            </div>

                            <div>
                                <span>Screening</span>
                                <strong>
                                    {analytics.Screening}
                                </strong>
                            </div>

                            <div>
                                <span>Interview</span>
                                <strong>
                                    {analytics.Interview}
                                </strong>
                            </div>

                            <div>
                                <span>Offer</span>
                                <strong>
                                    {analytics.Offer}
                                </strong>
                            </div>

                            <div>
                                <span>Rejected</span>
                                <strong>
                                    {analytics.Rejected}
                                </strong>
                            </div>

                        </div>

                    </section>
                </>
            )}

        </div>
    );
}

export default Analytics;