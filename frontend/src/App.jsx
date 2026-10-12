import { useState } from "react";
import "./App.css";

function App() {
  const [role, setRole] = useState("Full Stack Developer");
  const [interviewType, setInterviewType] = useState("Technical");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState({});
  const [error, setError] = useState("");
  const [savingInterview, setSavingInterview] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  async function generateQuestions(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setFeedback({});

    try {
      const response = await fetch(
        "https://ai-mock-interview-platform-fh0n.onrender.com/generate-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            interview_type: interviewType,
            experience_level: experienceLevel,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Unable to generate questions."
        );
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setQuestions(data.questions || []);

      if (!data.questions?.length) {
        setError("No questions were generated. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function evaluateAnswer(index, question) {
    const answer = answers[index]?.trim();

    if (!answer) {
      setError(`Please write your answer to Question ${index + 1}.`);
      return;
    }

    setError("");

    setEvaluating((previous) => ({
      ...previous,
      [index]: true,
    }));

    setFeedback((previous) => ({
      ...previous,
      [index]: "",
    }));

    try {
      const response = await fetch(
        "https://ai-mock-interview-platform-fh0n.onrender.com/evaluate-answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            question: question.replace(/^\s*\d+\.\s*/, ""),
            answer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to evaluate your answer."
        );
      }

      setFeedback((previous) => ({
        ...previous,
        [index]: data.feedback,
      }));
    } catch (err) {
      setError(err.message || "Could not evaluate your answer.");
    } finally {
      setEvaluating((previous) => ({
        ...previous,
        [index]: false,
      }));
    }
  }

  const evaluatedScores = questions
  .map((_, index) => {
    const text = feedback[index] || "";
    const match = text.match(
      /Score\s*:\s*\*{0,2}\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i
    );

    return match ? Number(match[1]) : null;
  })
  .filter((score) => score !== null);

const averageScore =
  evaluatedScores.length > 0
    ? (
        evaluatedScores.reduce((total, score) => total + score, 0) /
        evaluatedScores.length
      ).toFixed(1)
    : null;

    async function saveInterview() {
  if (averageScore === null) {
    setSaveMessage("Please evaluate at least one answer first.");
    return;
  }

  setSavingInterview(true);
  setSaveMessage("");

  try {
    const scores = questions.map((_, index) => {
      const text = feedback[index] || "";
      const match = text.match(
        /Score\s*:\s*\*{0,2}\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i
      );

      return match ? `${match[1]}/10` : "Not evaluated";
    });

    const response = await fetch(
      "https://ai-mock-interview-platform-fh0n.onrender.com/save-interview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          interview_type: interviewType,
          experience_level: experienceLevel,
          questions,
          scores,
          average_score: Number(averageScore),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Could not save interview.");
    }

    setSaveMessage("Interview saved successfully! 🎉");
  } catch (err) {
    setSaveMessage(`Error: ${err.message}`);
  } finally {
    setSavingInterview(false);
  }
}

async function loadInterviewHistory() {
  setHistoryLoading(true);
  setHistoryError("");
  setShowHistory(true);

  try {
    const response = await fetch(
      "https://ai-mock-interview-platform-fh0n.onrender.com/interview-history"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Could not load interview history."
      );
    }

    setHistory(data.history || []);
  } catch (err) {
    setHistoryError(err.message || "Could not connect to the backend.");
  } finally {
    setHistoryLoading(false);
  }
}

  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="/">
          <span className="logo-icon">AI</span>
          <span>
            Interview<span className="logo-highlight">Prep</span>
          </span>
        </a>

        <span className="nav-badge">AI Powered</span>
      </nav>

      <main className="hero">
        <div className="hero-badge">
          <span className="status-dot"></span>
          YOUR PERSONAL AI INTERVIEWER
        </div>

        <h1>
          Ace Your Next
          <br />
          <span>Interview.</span>
        </h1>

        <p className="hero-description">
          Practice real interview questions, improve your answers,
          and build the confidence to land your dream job.
        </p>

        <form className="interview-card" onSubmit={generateQuestions}>
          <h2>Prepare for your interview</h2>

          <p className="card-description">
            Customize your session and generate questions with AI.
          </p>

          <label htmlFor="role">Job Role</label>

          <input
            id="role"
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="e.g. Full Stack Developer"
            required
          />

          <label htmlFor="interviewType">Interview Type</label>

          <select
            id="interviewType"
            value={interviewType}
            onChange={(event) => setInterviewType(event.target.value)}
          >
            <option value="Technical">Technical Interview</option>
            <option value="HR">HR Interview</option>
          </select>

          <label htmlFor="experienceLevel">Experience Level</label>

          <select
            id="experienceLevel"
            value={experienceLevel}
            onChange={(event) => setExperienceLevel(event.target.value)}
          >
            <option value="Fresher">Fresher</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Experienced">Experienced</option>
          </select>

          <button
            className="generate-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Generating Questions..." : "Generate Questions →"}
          </button>
        </form>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {questions.length > 0 && (
          <section className="questions-section">
            <h2>Your Interview Questions</h2>

            <p className="card-description">
              {role} · {interviewType} · {experienceLevel}
            </p>

            {questions.map((question, index) => (
              <article className="question-card" key={index}>
                <h3>
                  Question {index + 1}
                </h3>

                <p className="question-text">
                  {question.replace(/^\s*\d+\.\s*/, "")}
                </p>

                <label htmlFor={`answer-${index}`}>
                  Your Answer
                </label>

                <textarea
                  id={`answer-${index}`}
                  value={answers[index] || ""}
                  onChange={(event) =>
                    setAnswers((previous) => ({
                      ...previous,
                      [index]: event.target.value,
                    }))
                  }
                  placeholder="Write your answer here..."
                  rows={5}
                />

                <button
                  className="generate-button"
                  type="button"
                  disabled={Boolean(evaluating[index])}
                  onClick={() => evaluateAnswer(index, question)}
                >
                  {evaluating[index]
                    ? "Evaluating Answer..."
                    : "Evaluate My Answer"}
                </button>

                {feedback[index] && (
                  <div className="feedback-box">
                    <h3>🤖 AI Feedback</h3>

                    <pre>{feedback[index]}</pre>
                  </div>
                )}
              </article>
            ))}

            {averageScore !== null && (
  <div className="performance-summary">
    <h2>📊 Interview Performance</h2>

    <div className="score-card">
      <span className="score-number">
        {averageScore}/10
      </span>

      <span className="score-label">
        Average Score
      </span>
    </div>

    <p className="progress-text">
      Questions evaluated: {evaluatedScores.length} / {questions.length}
    </p>

    <div className="progress-track">
      <div
        className="progress-fill"
        style={{
          width: `${
            questions.length > 0
              ? (evaluatedScores.length / questions.length) * 100
              : 0
          }%`,
        }}
      />
    </div>

    <p className="performance-message">
      {Number(averageScore) >= 8
        ? "Excellent work! Keep practising to maintain your performance."
        : Number(averageScore) >= 6
          ? "Good effort! Review the feedback and keep improving."
          : "Keep practising! Focus on the suggestions provided in your feedback."}
    </p>

    <button
  className="generate-button"
  type="button"
  onClick={saveInterview}
  disabled={savingInterview}
>
  {savingInterview ? "Saving Interview..." : "Save Interview"}
</button>

<button
  className="generate-button"
  type="button"
  onClick={loadInterviewHistory}
>
  View Interview History
</button>

{saveMessage && (
  <p role="status" className="save-message">
    {saveMessage}
  </p>
)}
  </div>
)}
          </section>
        )}

        {showHistory && (
  <section className="questions-section">
    <h2>📚 Interview History</h2>

    {historyLoading && <p>Loading interview history...</p>}

    {historyError && (
      <p className="error-message">{historyError}</p>
    )}

    {!historyLoading && !historyError && history.length === 0 && (
      <p>No saved interviews yet. Complete and save an interview first.</p>
    )}

    {!historyLoading &&
      history.map((item) => (
        <article className="question-card" key={item.id}>
          <h3>{item.role}</h3>

          <p>Interview Type: {item.interview_type}</p>
          <p>Experience: {item.experience_level}</p>
          <p>Average Score: {item.average_score}/10</p>
          <p>
            Date:{" "}
            {new Date(item.created_at + "Z").toLocaleString()}
          </p>

          <details>
            <summary>View Questions and Scores</summary>

            {item.questions.map((question, index) => (
              <div key={index}>
                <p>
                  <strong>Question {index + 1}:</strong>{" "}
                  {question}
                </p>

                <p>
                  <strong>Score:</strong>{" "}
                  {item.scores[index] || "Not evaluated"}
                </p>
              </div>
            ))}
          </details>
        </article>
      ))}
  </section>
)}

        <div className="hero-footer">
          <span>Practice smarter.</span>
          <span>Perform better.</span>
          <span>Get hired.</span>
        </div>
      </main>
    </div>
  );
}

export default App;