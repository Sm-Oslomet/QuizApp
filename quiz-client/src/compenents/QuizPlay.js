import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Load quiz from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const found = saved.find((q) => q.id === id);
    if (found) {
      setQuiz(found);
    } else {
      alert("Quiz not found!");
      navigate("/select");
    }
  }, [id, navigate]);

  // 🔹 Handle answer click
  const handleAnswer = (option) => {
    const currentQuestion = quiz.questions[current];
    setSelected(option);

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Wrong! Correct answer: ${currentQuestion.correctAnswer}`);
    }
  };

  // 🔹 Go to next question
  const handleNext = () => {
    setFeedback("");
    setSelected(null);
    if (current + 1 < quiz.questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  if (!quiz) return <p className="text-center mt-5">Loading quiz...</p>;

  // 🔹 Show result page
  if (finished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="container py-5 text-center">
        <h2 className="text-primary mb-4">{quiz.title}</h2>
        <h4>
          You got {score} / {quiz.questions.length} correct!
        </h4>
        <p>That’s {percentage}%</p>

        <div className="progress my-3" style={{ height: "25px" }}>
          <div
            className={`progress-bar ${
              percentage >= 70
                ? "bg-success"
                : percentage >= 40
                ? "bg-warning"
                : "bg-danger"
            }`}
            style={{ width: `${percentage}%` }}
          >
            {percentage}%
          </div>
        </div>

        <button
          className="btn btn-primary me-2"
          onClick={() => {
            setCurrent(0);
            setScore(0);
            setFinished(false);
          }}
        >
           Restart Quiz
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/select")}
        >
          🔙 Back to Quizzes
        </button>
      </div>
    );
  }

  const question = quiz.questions[current];
  const livePercentage = Math.round((score / quiz.questions.length) * 100);

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">{quiz.title}</h2>

      {/* 🔸 Live score display */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold">
          Question {current + 1} / {quiz.questions.length}
        </span>
        <span className="text-success fw-bold">
          Score: {score} ({livePercentage}%)
        </span>
      </div>

      <div className="card shadow p-4">
        <p className="fw-bold">{question.text}</p>

        <div className="list-group">
          {question.options.map((option, i) => {
            let buttonClass = "list-group-item list-group-item-action";

            if (selected) {
              if (option === question.correctAnswer) {
                buttonClass += " list-group-item-success"; // green
              } else if (
                option === selected &&
                option !== question.correctAnswer
              ) {
                buttonClass += " list-group-item-danger"; //  red
              } else {
                buttonClass += " disabled";
              }
            }

            return (
              <button
                key={i}
                className={buttonClass}
                onClick={() => !selected && handleAnswer(option)}
                disabled={!!selected}
              >
                {option}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div
            className={`alert mt-3 ${
              feedback.startsWith("✅")
                ? "alert-success"
                : "alert-danger"
            } text-center`}
          >
            {feedback}
          </div>
        )}

        {/* 🔹 Next button appears only after answering */}
        {selected && (
          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={handleNext}>
              ➡️ Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPlay;
