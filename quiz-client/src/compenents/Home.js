import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./Login/AuthService";
import { FaPlayCircle, FaPlusCircle, FaGraduationCap } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleGuest = () => {
    authService.guestLogin();
    navigate("/select");
  };

  const quizzes = [
    {
      title: "JavaScript Basics",
      description: "Test your knowledge of JS fundamentals.",
      difficulty: "Easy",
      attempts: 42,
      color: "#e3f2fd",
    },
    {
      title: "React Hooks Deep Dive",
      description: "Advanced concepts in React Hooks and state.",
      difficulty: "Medium",
      attempts: 27,
      color: "#ede7f6",
    },
    {
      title: "CSS Layout Mastery",
      description: "Master Flexbox and Grid layouts like a pro.",
      difficulty: "Hard",
      attempts: 15,
      color: "#fff3e0",
    },
  ];

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center"
      style={{
        background: "linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      {/* Hero Section */}
      <div
        className="text-center shadow-lg p-5 rounded-4 mb-5"
        style={{
          backgroundColor: "white",
          width: "90%",
          maxWidth: "850px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#2b2d42" }}>
          Welcome to <span style={{ color: "#007bff" }}>QuizApp</span>
        </h1>
        <p className="lead text-muted mb-4">
          {user
            ? user.guest
              ? "Hello, Guest 👋 Ready to learn something new?"
              : `Hello, ${user.username}! Let’s explore your next challenge.`
            : "Join now or continue as a guest to explore fun quizzes!"}
        </p>

        <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate("/select")}
                className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
              >
                <FaPlayCircle className="me-2" />
                Choose a Quiz
              </button>
              <button
                onClick={() => navigate("/create")}
                className="btn btn-primary px-4 py-2 rounded-pill fw-semibold text-white shadow-sm"
              >
                <FaPlusCircle className="me-2" />
                Create a Quiz
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
              >
                Log In
              </button>
              <button
                onClick={handleGuest}
                className="btn px-4 py-2 rounded-pill fw-semibold text-white shadow-sm"
                style={{
                  background: "linear-gradient(90deg, #007bff, #6a11cb)",
                  border: "none",
                }}
              >
                Continue as Guest
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quizzes Section */}
      <h3 className="fw-bold mb-4" style={{ color: "#2b2d42" }}>
        <FaGraduationCap className="me-2 text-primary" />
        Popular Quizzes
      </h3>

      <div className="row g-4 justify-content-center w-100 px-4">
        {quizzes.map((quiz, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                backgroundColor: quiz.color,
                borderRadius: "16px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0,0,0,0.05)";
              }}
            >
              <div className="card-body text-start">
                <h5 className="fw-bold" style={{ color: "#2b2d42" }}>
                  {quiz.title}
                </h5>
                <p className="text-muted small mb-3">{quiz.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className="badge text-white px-3 py-2"
                    style={{
                      backgroundColor:
                        quiz.difficulty === "Easy"
                          ? "#4caf50"
                          : quiz.difficulty === "Medium"
                          ? "#ffb300"
                          : "#f44336",
                    }}
                  >
                    {quiz.difficulty}
                  </span>
                  <small className="text-secondary">
                    Attempts: {quiz.attempts}
                  </small>
                </div>
                <button
                  onClick={() => navigate("/play/1")}
                  className="btn btn-sm btn-outline-primary mt-3 w-100 rounded-pill fw-semibold"
                >
                  Take Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-muted mt-5 small">
        © 2025 QuizApp | Designed by Group ITPE3200
      </p>
    </div>
  );
}

export default Home;





