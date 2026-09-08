import { useEffect, useState } from "react";
import "./Interviews.css";

const API_URL = "https://careerpilot-n4ys.onrender.com/api/interview";

function Interviews() {
  const [jobDescription, setJobDescription] = useState("");
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch interview history
  const fetchInterviews = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch interviews");
      setInterviews(data.interviews || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchInterviews();
  }, []);

  // Generate interview
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      setMessage("Please enter a job description.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobDescription: jobDescription.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Interview generation failed");
      }

      setInterviews((prev) => [data.interview, ...prev]);
      setSelectedInterview(data.interview);
      setAnswers({});
      setEvaluations({});
      setShowAnswers({});
      setJobDescription("");
      setMessage("Interview questions generated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open interview
  const handleSelectInterview = async (interviewId) => {
    try {
      setMessage("");

      const response = await fetch(`${API_URL}/${interviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load interview");
      }

      setSelectedInterview(data.interview);
      setAnswers({});
      setEvaluations({});
      setShowAnswers({});

      data.interview.questions.forEach((question, index) => {
        if (question.candidateAnswer) {
          const key = `${interviewId}-${index}`;

          setAnswers((prev) => ({
            ...prev,
            [key]: question.candidateAnswer,
          }));

          setEvaluations((prev) => ({
            ...prev,
            [key]: {
              score: question.score,
              feedback: question.feedback,
              improvement: question.improvement,
            },
          }));
        }
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Submit and evaluate answer
  const handleEvaluate = async (interview, questionIndex, key) => {
    const answer = answers[key]?.trim();

    if (!answer) {
      setMessage("Please write your answer first.");
      return;
    }

    try {
      setEvaluating(key);
      setMessage("");

      const response = await fetch(`${API_URL}/submit-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interviewId: interview._id,
          questionIndex,
          answer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Evaluation failed");
      }

      setEvaluations((prev) => ({
        ...prev,
        [key]: data.result,
      }));

      setSelectedInterview((prev) => ({
        ...prev,
        questions: prev.questions.map((question, index) =>
          index === questionIndex
            ? {
                ...question,
                candidateAnswer: answer,
                score: data.result.score,
                feedback: data.result.feedback,
                improvement: data.result.improvement,
              }
            : question
        ),
        status: data.status,
        totalScore: data.totalScore,
      }));

      setInterviews((prev) =>
        prev.map((item) =>
          item._id === interview._id
            ? {
                ...item,
                status: data.status,
                totalScore: data.totalScore,
              }
            : item
        )
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setEvaluating(null);
    }
  };

  // Toggle model answer
  const toggleSuggested = (key) => {
    setShowAnswers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="interviews-page">
      <div className="interviews-header">
        <span>✦ AI CAREER TOOL</span>
        <h1>Interview Preparation</h1>
        <p>
          Generate AI-powered interview questions and practice your answers.
        </p>
      </div>

      {/* Generate Interview */}
      <form className="interview-form" onSubmit={handleGenerate}>
        <h2>Generate Interview Questions</h2>
        <label>Job Description</label>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the complete job description here..."
          rows="10"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Generating Questions..." : "Generate Questions →"}
        </button>
      </form>

      {message && <p className="interview-message">{message}</p>}

      {/* Interview History */}
      <section className="interview-history">
        <div className="section-heading">
          <span>✦ YOUR INTERVIEWS</span>
          <h2>Interview History</h2>
          <p>View and continue your previous interview preparations.</p>
        </div>

        {historyLoading ? (
          <p className="history-empty">Loading interviews...</p>
        ) : interviews.length === 0 ? (
          <p className="history-empty">No interviews created yet.</p>
        ) : (
          <div className="history-grid">
            {interviews.map((interview) => (
              <button
                className={`history-card ${
                  selectedInterview?._id === interview._id ? "active" : ""
                }`}
                key={interview._id}
                onClick={() => handleSelectInterview(interview._id)}
              >
                <div className="history-card-top">
                  <span>AI INTERVIEW</span>
                  <small>
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </small>
                </div>

                <h3>
                  {interview.jobDescription.split("\n")[0].slice(0, 70)}
                  {interview.jobDescription.length > 70 ? "..." : ""}
                </h3>

                <div className="history-card-bottom">
                  <span>{interview.questions?.length || 0} Questions</span>

                  <strong
                    className={
                      interview.status === "completed"
                        ? "completed"
                        : "in-progress"
                    }
                  >
                    {interview.status}
                  </strong>
                </div>

                {interview.status === "completed" && (
                  <div className="history-score">
                    Score: {(interview.totalScore / 10).toFixed(1)}/10
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Selected Interview */}
      {selectedInterview && (
        <section className="interview-list">
          <div className="section-heading">
            <span>✦ AI INTERVIEW SIMULATOR</span>
            <h2>Practice Questions</h2>
            <p>Answer each question and get instant AI feedback.</p>
          </div>

          <div className="interview-card">
            <div className="interview-info">
              <span>AI INTERVIEW PREPARATION</span>
              <p>
                Created on{" "}
                {new Date(selectedInterview.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="questions-list">
              {selectedInterview.questions?.map((item, index) => {
                const key = `${selectedInterview._id}-${index}`;

                return (
                  <div className="question-card" key={key}>
                    <div className="question-top">
                      <span>{item.category}</span>
                      <small>
                        {index + 1}/{selectedInterview.questions.length}
                      </small>
                    </div>

                    <h3>{item.question}</h3>

                    <textarea
                      value={answers[key] || ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder="Write your interview answer..."
                      rows="5"
                      disabled={Boolean(item.candidateAnswer)}
                    />

                    <div className="question-actions">
                      <button
                        type="button"
                        className="evaluate-button"
                        onClick={() =>
                          handleEvaluate(selectedInterview, index, key)
                        }
                        disabled={
                          evaluating === key || Boolean(item.candidateAnswer)
                        }
                      >
                        {evaluating === key
                          ? "Evaluating..."
                          : item.candidateAnswer
                          ? "Evaluated ✓"
                          : "Evaluate Answer →"}
                      </button>

                      <button
                        type="button"
                        className="suggested-button"
                        onClick={() => toggleSuggested(key)}
                      >
                        {showAnswers[key]
                          ? "Hide Model Answer"
                          : "Show Model Answer"}
                      </button>
                    </div>

                    {evaluations[key] && (
                      <div className="evaluation-card">
                        <div className="evaluation-score">
                          <span>AI SCORE</span>
                          <strong>{evaluations[key].score}/10</strong>
                        </div>

                        <div>
                          <b>Feedback</b>
                          <p>{evaluations[key].feedback}</p>
                        </div>

                        <div>
                          <b>Improvement</b>
                          <p>{evaluations[key].improvement}</p>
                        </div>
                      </div>
                    )}

                    {showAnswers[key] && (
                      <div className="suggested-answer">
                        <span>MODEL ANSWER</span>
                        <p>{item.modelAnswer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedInterview.status === "completed" && (
              <div className="interview-result">
                <span>INTERVIEW COMPLETED</span>
                <h3>Final Score</h3>
                <strong>
                  {(selectedInterview.totalScore / 10).toFixed(1)}/10
                </strong>

                <p>
                  {
                    selectedInterview.questions.filter((question) =>
                      question.candidateAnswer?.trim()
                    ).length
                  }{" "}
                  / {selectedInterview.questions.length} Questions Answered
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default Interviews;