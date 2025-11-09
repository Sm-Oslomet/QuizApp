import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Home() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const greetingName = user?.guest
    ? "Guest"
    : user?.name || user?.email?.split("@")[0] || "User";

  const handleGuest = () => {
    authService.guestLogin();
    navigate("/select");
  };

  const ButtonsBlock = () => {
    //  Innlogget bruker
    if (user) {
      return (
        <>
          <div className="text-center mb-4">
            <h3 className="fw-semibold mb-1">Welcome back, {greetingName}</h3>
            <p className="text-muted mb-0">What would you like to do today?</p>
          </div>

          <div className="row g-3 justify-content-center">
            <div className="col-12 col-md-5">
              <button
                onClick={() => navigate("/select")}
                className="btn btn-primary btn-lg w-100"
              >
                Choose an Existing Quiz
              </button>
            </div>

            <div className="col-12 col-md-5">
              <button
                onClick={() => navigate("/create")}
                className="btn btn-primary btn-lg w-100"
              >
                Create a New Quiz
              </button>
            </div>
          </div>
        </>
      );
    }

    // Ikke innlogget
    return (
      <>
        <div className="text-center mb-4">
          <p className="text-muted fs-5 mb-0">
            Log in or continue as guest to get started.
          </p>
        </div>

        <div className="row g-3 justify-content-center">
          <div className="col-12 col-md-5">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary btn-lg w-100"
            >
              Log In
            </button>
          </div>

          <div className="col-12 col-md-5">
            <button
              onClick={handleGuest}
              className="btn btn-primary btn-lg w-100"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container" style={{ marginTop: "80px", maxWidth: "880px" }}>
      
      {/* Hero */}
      <div className="text-center mb-4">
        <h1 className="fw-bold display-5 text-primary mb-2">QuizApp</h1>
        <p className="text-muted fs-5 mb-0">
          Create, play, and improve with clean, focused quizzes.
        </p>
      </div>

      {/* Card */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <ButtonsBlock />
        </div>
      </div>
    </div>
  );
}
