import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizService } from "../api/quizService";

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
  const [correctIndex, setCorrectIndex] = useState(null);

  const handleOptionChange = (i, value) => {
    const next = [...currentQuestion.options];
    next[i] = value;
    setCurrentQuestion((q) => ({
      ...q,
      options: next,
      correctAnswer: correctIndex === i ? value : q.correctAnswer,
    }));
  };

  const addQuestion = () => {
    if (
      !currentQuestion.text.trim() ||
      currentQuestion.options.some((o) => !o.trim()) ||
      correctIndex === null
    ) {
      alert("Please fill in the question , all options, and select the correct answer.");
      return;
    }

    const q = {
      text: currentQuestion.text.trim(),
      options: currentQuestion.options.map((o) => o.trim()),
      correctAnswer: currentQuestion.options[correctIndex].trim(),
    };

    setQuestions((prev) => [...prev, q]);
    setCurrentQuestion({ text: "", options: ["", "", "", ""], correctAnswer: "" });
    setCorrectIndex(null);
  };

  const finishQuiz = async () => {
    if (!title.trim() || questions.length === 0) {
      alert("Please enter a title and at least one question.");
      return;
    }

    const newQuiz = {
      title: title.trim(),
      description: description.trim(),
      questions,
    };



      try {
          await quizService.create(newQuiz);
          alert("Quiz saved to server!");
          navigate("/select");
      } catch (err) {
          console.error("Quiz creation failed:", err);
          alert(err.message || "Failed to save quiz");
      }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">Create a New Quiz</h2>

      <div className="card shadow-sm p-4 mb-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm p-4">
        <h5 className="mb-3">Add a Question</h5>
        <input
          className="form-control mb-3"
          placeholder="Write the question..."
          value={currentQuestion.text}
          onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
        />

        <div className="row g-2">
          {currentQuestion.options.map((opt, i) => (
            <div className="col-sm-6" key={i}>
              <div
                className={`input-group ${correctIndex === i ? "border border-success rounded" : ""}`}
              >
                <div className="input-group-text">
                  <input
                    type="radio"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                    className="form-check-input mt-0"
                  />
                </div>
                <input
                  className="form-control"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary" onClick={addQuestion}>
             Add Question
          </button>
          <button className="btn btn-success" onClick={finishQuiz}>
            Save Quiz
          </button>
        </div>
      </div>

      <div className="text-muted mt-3">Questions: {questions.length}</div>
    </div>
  );
}

export default CreateQuiz;
