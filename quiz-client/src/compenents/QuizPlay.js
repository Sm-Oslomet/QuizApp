import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quizzes") || "[]");
    setQuiz(saved[id]);
  }, [id]);

  if (!quiz) return <p>Laster quiz...</p>;

  const question = quiz.questions[currentQuestionIndex];

  const handleAnswer = () => {
    if (selectedAnswer === "") {
      alert("Velg et svar først!");
      return;
    }

    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      setFinished(true);
      saveResult();
    }
  };

  const saveResult = () => {
    const now = new Date();
    const result = {
      score,
      total: quiz.questions.length,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    if (!savedQuizzes[id].results) {
      savedQuizzes[id].results = [];
    }
    savedQuizzes[id].results.push(result);
    localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setFinished(false);
  };

  const goBack = () => navigate("/select");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!finished ? (
        <div>
          <h2>{quiz.title}</h2>
          <p>
            Spørsmål {currentQuestionIndex + 1} av {quiz.questions.length}
          </p>
          <h3>{question.text}</h3>

          {question.options.map((opt, i) => (
            <div key={i} style={{ margin: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  checked={selectedAnswer === opt}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
                {" "}{opt}
              </label>
            </div>
          ))}

          <button
            onClick={handleAnswer}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            {currentQuestionIndex + 1 < quiz.questions.length
              ? "Neste spørsmål ➡️"
              : "Fullfør quiz ✅"}
          </button>
        </div>
      ) : (
        <div>
          <h2>🎉 Du er ferdig!</h2>
          <p>
            Poengsum: {score} av {quiz.questions.length}
          </p>
          <p>
            {score === quiz.questions.length
              ? "Perfekt score!"
              : score > quiz.questions.length / 2
              ? "Godt jobbet! "
              : "Du kan prøve igjen"}
          </p>

          <button onClick={restartQuiz} style={{ padding: "8px 16px", margin: "5px" }}>
            Prøv igjen
          </button>

          <button onClick={goBack} style={{ padding: "8px 16px", margin: "5px" }}>
            Tilbake til quizliste
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizPlay;
