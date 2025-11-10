import React from "react";

function QuizCard({ quiz, onPlay, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{quiz.title}</h5>
        <p className="text-muted">{quiz.description || "No description"}</p>
        <p className="small text-secondary mb-3">
          Questions: {quiz.questions?.length || 0}
        </p>

        <div className="mt-auto d-flex justify-content-between">
          <button className="btn btn-primary btn-sm" onClick={onPlay}>
             Play
          </button>
          <button className="btn btn-warning btn-sm text-white" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;
