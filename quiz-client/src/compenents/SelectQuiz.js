import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { QuizHandler } from "./QuizHandler"; 

function SelectQuiz() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // last quizer ved mount
  useEffect(() => {
    loadQuizzes();
  }, []);

  async function loadQuizzes() {
    setLoading(true);
    try {
      let all = await QuizHandler.getAll();

      // Hvis ingen quizer finnes ennå, ikke last eksempler automatisk her,
      // bare vis "No quizzes found" skjermen. (Dette matcher koden din.)
      setQuizzes(all);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
      alert("Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this quiz?")) return;

    try {
        await QuizHandler.delete(id);
        setQuizzes((prev) => prev.filter((q) => q.quizId !== id));
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      alert("Failed to delete quiz.");
    }
  }

  async function handleLoadExamples() {
    try {
      await QuizHandler.loadExamples();
      alert("Example quizzes added!");
      // reload list
      loadQuizzes();
    } catch (err) {
      console.error("Failed to load example quizzes:", err);
      alert("Failed to load example quizzes.");
    }
  }

  if (loading) {
    return <p className="text-center mt-5">Loading quizzes...</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-4">Select a Quiz</h1>

      {quizzes.length === 0 ? (
        <div className="alert alert-info text-center">
          No quizzes found.
          <div className="mt-3 d-flex flex-column align-items-center gap-2">
            <button
              className="btn btn-success"
              onClick={() => navigate("/create")}
            >
              Create New Quiz
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={handleLoadExamples}
            >
              Example Quizzes
            </button>
          </div>
        </div>
      ) : (
        <>
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
                      Questions: {quiz.questions?.length || 0}
                    </p>

                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/play/${quiz.quizId}`)}
                      >
                        Play
                      </button>

                      <button
                        className="btn btn-warning btn-sm text-white"
                            onClick={() => navigate(`/edit/${quiz.quizId}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(quiz.quizId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-3 d-flex flex-column align-items-center gap-2">
            <button
              className="btn btn-success"
              onClick={() => navigate("/create")}
            >
              Create New Quiz
            </button>

            <button
              className="btn btn-outline-primary"
              onClick={handleLoadExamples}
            >
              Example Quizzes
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SelectQuiz;
