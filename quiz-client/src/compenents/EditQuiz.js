import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditQuiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  // Hent eksisterende quiz fra localStorage
  React.useEffect(() => {
    const all = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const found = all.find((q) => q.id === id);
    if (!found) {
      alert("Quiz not found.");
      navigate("/select");
      return;
    }

    // Sørg for at alle spørsmål har 4 alternativer
    const normalized = {
      ...found,
      questions: found.questions.map((q) => ({
        ...q,
        options: [...q.options, "", "", "", ""].slice(0, 4),
        correctAnswer: q.correctAnswer || "",
      })),
    };

    setQuiz(normalized);
  }, [id, navigate]);

  // Finn hvilket alternativ som er riktig i hvert spørsmål
  const correctIndexes = useMemo(() => {
    if (!quiz) return [];
    return quiz.questions.map((q) =>
      Math.max(0, q.options.findIndex((o) => o === q.correctAnswer))
    );
  }, [quiz]);

  // Når man endrer hvilket svar som er korrekt
  const setCorrectIndex = (questionIndex, optionIndex) => {
    setQuiz((prev) => {
      const updated = { ...prev };
      const question = { ...updated.questions[questionIndex] };
      question.correctAnswer = question.options[optionIndex] || "";
      updated.questions = updated.questions.map((q, i) =>
        i === questionIndex ? question : q
      );
      return updated;
    });
  };

  // Endre tittel eller beskrivelse
  const handleMeta = (field, value) =>
    setQuiz((q) => ({ ...q, [field]: value }));

  // Endre spørsmålstekst
  const handleQuestionText = (index, value) => {
    setQuiz((prev) => {
      const updated = { ...prev };
      updated.questions[index].text = value;
      return updated;
    });
  };

  // Endre alternativer
  const handleOption = (qi, oi, value) => {
    setQuiz((prev) => {
      const updated = { ...prev };
      const question = { ...updated.questions[qi] };
      const options = [...question.options];
      const wasCorrect = question.correctAnswer === options[oi];
      options[oi] = value;
      question.options = options;
      if (wasCorrect) question.correctAnswer = value;
      updated.questions[qi] = question;
      return updated;
    });
  };

  // Legg til nytt spørsmål
  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    }));
  };

  // 🔹 Slett spørsmål
  const removeQuestion = (index) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Lagre endringer
  const handleSave = () => {
    if (!quiz.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    const cleaned = {
      ...quiz,
      title: quiz.title.trim(),
      description: (quiz.description || "").trim(),
      questions: quiz.questions.map((q) => ({
        text: q.text.trim(),
        options: q.options.map((o) => o.trim()),
        correctAnswer: (q.correctAnswer || "").trim(),
      })),
    };

    if (
      cleaned.questions.some(
        (q) => !q.text || q.options.some((o) => !o) || !q.correctAnswer
      )
    ) {
      alert(
        "Each question must have text, four options, and a selected correct answer."
      );
      return;
    }

    const all = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const index = all.findIndex((x) => x.id === cleaned.id);
    if (index === -1) {
      alert("Could not save: Quiz not found in storage.");
      return;
    }

    all[index] = cleaned;
    localStorage.setItem("quizzes", JSON.stringify(all));
    alert(" Quiz saved successfully!");
    navigate("/select");
  };

  if (!quiz) return <p className="text-center mt-5">Loading quiz...</p>;

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">✏️ Edit Quiz</h2>

      {/* Quiz title and description */}
      <div className="card shadow-sm p-4 mb-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            className="form-control"
            value={quiz.title}
            onChange={(e) => handleMeta("title", e.target.value)}
          />
        </div>
        <div>
          <label className="form-label fw-semibold">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={quiz.description || ""}
            onChange={(e) => handleMeta("description", e.target.value)}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Questions</h5>
        <button className="btn btn-outline-primary btn-sm" onClick={addQuestion}>
          Add Question
        </button>
      </div>

      {quiz.questions.map((q, qi) => (
        <div className="card mb-3" key={qi}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <input
                className="form-control me-2"
                value={q.text}
                onChange={(e) => handleQuestionText(qi, e.target.value)}
                placeholder={`Question ${qi + 1}`}
              />
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeQuestion(qi)}
              >
                Delete
              </button>
            </div>

            <div className="row g-2">
              {q.options.map((opt, oi) => (
                <div className="col-sm-6" key={oi}>
                  <div className="input-group">
                    <div className="input-group-text">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        className="form-check-input mt-0"
                        checked={correctIndexes[qi] === oi}
                        onChange={() => setCorrectIndex(qi, oi)}
                        title="Mark as correct"
                      />
                    </div>
                    <input
                      className="form-control"
                      value={opt}
                      onChange={(e) => handleOption(qi, oi, e.target.value)}
                      placeholder={`Option ${oi + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <small className="text-muted d-block mt-2">
              Correct answer:{" "}
              <strong>{q.correctAnswer || "– not selected –"}</strong>
            </small>
          </div>
        </div>
      ))}

      {/* Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/select")}>
          Back
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditQuiz;
