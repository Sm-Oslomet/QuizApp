import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectQuiz() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  // Gi alle quizer som mangler id en unik id
  const ensureIds = (list) =>
    list.map((q) =>
      q.id
        ? q
        : {
            ...q,
            id:
              crypto.randomUUID?.() ||
              String(Date.now() + Math.random()),
          }
    );

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const fixed = ensureIds(saved);

    if (fixed.some((q, i) => q.id !== (saved[i]?.id))) {
      localStorage.setItem("quizzes", JSON.stringify(fixed));
      alert("Some old quizzes were missing IDs — fixed automatically!");
    }

    setQuizzes(fixed);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    const updated = quizzes.filter((q) => q.id !== id);
    setQuizzes(updated);
    localStorage.setItem("quizzes", JSON.stringify(updated));
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-4">Select a Quiz</h1>

      {quizzes.length === 0 ? (
        <div className="alert alert-info text-center">
          No quizzes found.
        </div>
      ) : (
        <div className="row">
          {quizzes.map((quiz) => (
            <div className="col-md-6 mb-4" key={quiz.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{quiz.title}</h5>
                  <p className="text-muted">
                    {quiz.description || "No description"}
                  </p>
                  <p className="small text-secondary">
                    Questions: {quiz.questions.length}
                  </p>

                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/play/${quiz.id}`)}
                    >
                       Play
                    </button>
                    <button
                      className="btn btn-warning btn-sm text-white"
                      onClick={() => navigate(`/edit/${quiz.id}`)}
                    >
                       Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(quiz.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-3">
        <button
          className="btn btn-success"
          onClick={() => navigate("/create")}
        >
          Create New Quiz
        </button>
      </div>
    </div>
  );
}

export default SelectQuiz;
