import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [wasCorrect, setWasCorrect] = useState(null); // true / false / null

  // last riktig quiz fra localStorage
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

  if (!quiz) {
    return <p className="text-center mt-5">Loading quiz...</p>;
  }

  const question = quiz.questions[current];
  const livePercentage = Math.round(
    (score / quiz.questions.length) * 100
  );

  // Når bruker klikker på et svar
  const handleAnswer = (option) => {
    if (selected) return; // ikke la bruker velge på nytt

    setSelected(option);

    if (option === question.correctAnswer) {
      setScore((prev) => prev + 1);
      setFeedbackText("✅ Correct!");
      setWasCorrect(true);
    } else {
      setFeedbackText(
        `❌ Wrong! Correct answer: ${question.correctAnswer}`
      );
      setWasCorrect(false);
    }
  };

  // Neste spørsmål / eller ferdig
  const handleNext = () => {
    const lastIndex = quiz.questions.length - 1;

    if (current < lastIndex) {
      // gå til neste spørsmål
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setFeedbackText("");
      setWasCorrect(null);
    } else {
      // ferdig -> send til resultatside
      navigate(`/result/${quiz.id}`, {
        state: {
          title: quiz.title,
          totalQuestions: quiz.questions.length,
          score: score,
        },
      });
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">
        {quiz.title}
      </h2>

      {/* topp-linje med fremdrift og score */}
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
            let buttonClass =
              "list-group-item list-group-item-action";

            if (selected) {
              if (option === question.correctAnswer) {
                // riktig svar vises grønn
                buttonClass += " list-group-item-success";
              } else if (option === selected) {
                // feil valgt → rød
                buttonClass += " list-group-item-danger";
              } else {
                // alle andre bli grå
                buttonClass += " disabled opacity-50";
              }
            }

            return (
              <button
                key={i}
                className={buttonClass}
                onClick={() => handleAnswer(option)}
                disabled={!!selected}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* feedback-tekst etter brukeren har svart */}
        {feedbackText && (
          <div
            className={`alert mt-3 text-center ${
              wasCorrect ? "alert-success" : "alert-danger"
            }`}
          >
            {feedbackText}
          </div>
        )}

        {/* Neste-knapp vises bare etter svar */}
        {selected && (
          <div className="text-center mt-3">
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              {current + 1 < quiz.questions.length
                ? "➡️ Next Question"
                : "🏁 See Results"}
            </button>
          </div>
        )}
      </div>

      {/* Tilbake til select (hvis de vil rage-quit 🤭) */}
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/select")}
        >
          ⬅ Back to quiz list
        </button>
      </div>
    </div>
  );
}

export default QuizPlay;
