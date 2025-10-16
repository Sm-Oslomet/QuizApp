import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quizzes") || "[]");
    setQuizzes(saved);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Velg en eksisterende quiz</h2>
      {quizzes.length === 0 ? (
        <p>Ingen quizer er laget ennå.</p>
      ) : (
        quizzes.map((quiz, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              margin: "15px auto",
              width: "340px",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "left",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ textAlign: "center" }}>{quiz.title}</h3>
            <p><strong>Beskrivelse:</strong> {quiz.description}</p>
            <p><strong>Antall spørsmål:</strong> {quiz.questions.length}</p>

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                onClick={() => navigate(`/play/${i}`)}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                ▶️ Start quiz
              </button>
            </div>

            {quiz.results && quiz.results.length > 0 && (
              <div style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "8px" }}>
                <h4>📊 Tidligere resultater:</h4>
                <ul>
                  {quiz.results.map((res, idx) => (
                    <li key={idx}>
                      {res.date} kl. {res.time}: {res.score}/{res.total} poeng
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default SelectQuiz;
