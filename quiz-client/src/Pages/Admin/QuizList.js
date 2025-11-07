import React from "react";

export default function QuizList({ quizzes, deleteQuiz }) {
  return (
    <>
      <h2 className="fw-bold mb-4">Quizzes</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          {quizzes.length === 0 ? (
            <p className="text-muted">No quizzes found.</p>
          ) : (
            <ul className="list-group">
              {quizzes.map((q) => (
                <li
                  key={q.id}
                  className="list-group-item d-flex justify-content-between"
                >
                  <strong>{q.title}</strong>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteQuiz(q.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
