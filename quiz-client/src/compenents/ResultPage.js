import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";

function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // data som kom fra QuizPlay via navigate(..., { state: {...} })
  const { title, totalQuestions, score } = location.state || {};

  // hvis noen prøver å gå direkte til /result/:id uten state
  useEffect(() => {
    if (
      title === undefined ||
      totalQuestions === undefined ||
      score === undefined
    ) {
      // send dem tilbake til select
      navigate("/select");
    }
  }, [title, totalQuestions, score, navigate]);

  if (
    title === undefined ||
    totalQuestions === undefined ||
    score === undefined
  ) {
    // kort fallback render mens navigate kjører
    return null;
  }

  const percentage = Math.round((score / totalQuestions) * 100);

  // velg farge for progress bar
  let barClass = "bg-danger";
  if (percentage >= 70) {
    barClass = "bg-success";
  } else if (percentage >= 40) {
    barClass = "bg-warning";
  }

  return (
    <div className="container py-5 text-center">
      <h2 className="text-primary mb-4">{title}</h2>

      <h4>
        You got {score} / {totalQuestions} correct
      </h4>
      <p>That's {percentage}%</p>

      <div className="progress my-3 mx-auto" style={{ height: "25px", maxWidth: "400px" }}>
        <div
          className={`progress-bar ${barClass}`}
          style={{ width: `${percentage}%` }}
        >
          {percentage}%
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-center gap-2 mt-4">
        {/* Spill denne quizen igjen */}
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/play/${id}`)}
        >
          Try Again
        </button>

        {/* Gå og velg en annen quiz */}
        <Link className="btn btn-secondary" to="/select">
          Choose Another Quiz
        </Link>

        {/* Gå til hjem / dashboard */}
        <Link className="btn btn-outline-dark" to="/">
          Home
        </Link>
      </div>
    </div>
  );
}

export default ResultPage;
