import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PlayQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([]);
  const [quizInfo, setQuizInfo] = useState({ name: "", description: "" });
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const allQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const quizId = location.state?.quizId;
    const selected = allQuizzes.find((q) => q.id === quizId);
    if (!selected) {
      alert("Fant ikke quiz!");
      navigate("/select");
    } else {
      setQuiz(selected.questions);
      setQuizInfo({ name: selected.name, description: selected.description });
    }
  }, [location.state, navigate]);

  const handleAnswer = (selected) => {
    if (quiz[current].correctAnswer === selected) {
      setScore(score + 1);
    }

    const next = current + 1;
    if (next < quiz.length) {
      setCurrent(next);
    } else {
      setShowResult(true);
      // Etter 2 sekunder, naviger tilbake til SelectQuiz
      setTimeout(() => {
        navigate("/select");
      }, 2000);
    }
  };

  if (quiz.length === 0) return null;

  if (showResult)
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Quiz ferdig 🎉</h2>
        <p>
          Du fikk {score} av {quiz.length} riktige!
        </p>
        <p>Du blir sendt tilbake til quiz-valg om 2 sekunder...</p>
      </div>
    );

  const question = quiz[current];

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{quizInfo.name}</h2>
      <p>{quizInfo.description}</p>
      <h3>
        Spørsmål {current + 1} av {quiz.length}
      </h3>
      <h4>{question.question}</h4>
      {question.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(opt)}
          style={{
            display: "block",
            width: "300px",
            margin: "10px auto",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default PlayQuiz;
