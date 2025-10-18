import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options.some(o => !o) || !currentQuestion.correctAnswer) {
      alert("Vennligst fyll ut alle felter før du legger til spørsmålet.");
      return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  const finishQuiz = () => {
    if (!title || questions.length === 0) {
      alert("Fyll inn tittel og minst ett spørsmål.");
      return;
    }

    const newQuiz = { title, description, questions };
    const saved = JSON.parse(localStorage.getItem("quizzes") || "[]");
    localStorage.setItem("quizzes", JSON.stringify([...saved, newQuiz]));

    navigate("/select");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Lag en ny quiz</h2>

      <input
        type="text"
        placeholder="Quiz tittel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      />
      <br />

      <textarea
        placeholder="Beskrivelse"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: "10px", width: "300px", height: "80px" }}
      />
      <br />

      <h3>Legg til spørsmål</h3>
      <input
        type="text"
        placeholder="Skriv spørsmålet her"
        value={currentQuestion.text}
        onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      />
      <br />

      {currentQuestion.options.map((opt, i) => (
        <div key={i}>
          <input
            type="text"
            placeholder={`Alternativ ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            style={{ padding: "8px", width: "250px", margin: "5px" }}
          />
        </div>
      ))}

      <input
        type="text"
        placeholder="Riktig svar (skriv teksten)"
        value={currentQuestion.correctAnswer}
        onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
        style={{ padding: "8px", width: "250px", margin: "10px" }}
      />
      <br />

      <button onClick={addQuestion} style={{ padding: "10px 20px", margin: "5px" }}>
        ➕ Legg til spørsmål
      </button>

      <button onClick={finishQuiz} style={{ padding: "10px 20px", margin: "5px" }}>
        ✅ Ferdig quiz
      </button>

      <h4>Antall spørsmål: {questions.length}</h4>
    </div>
  );
}

export default CreateQuiz;
