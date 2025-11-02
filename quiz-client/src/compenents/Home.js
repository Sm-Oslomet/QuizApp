import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService"; 

function Home() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser(); // Hent innlogget bruker

  const handleGuest = () => {
    authService.guestLogin();
    navigate("/select");
  };

  return (
    <div
      className="container text-center"
      style={{ marginTop: "100px", maxWidth: "700px" }}
    >
      <h1 className="mb-4 text-primary fw-bold"> Welcome to QuizApp</h1>

      {user ? (
        <>
          <h4 className="mb-3">
            {user.guest
              ? "Hello, Guest"
              : `Hello, ${user.username}! `}
          </h4>

          <p className="text-muted mb-5">
            Ready to test your knowledge or make your own quiz?
          </p>

          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <button
              onClick={() => navigate("/select")}
              className="btn btn-primary btn-lg"
            >
             Choose an Existing Quiz
            </button>

            <button
              onClick={() => navigate("/create")}
              className="btn btn-success btn-lg"
            >
               Create a New Quiz
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-muted mb-5">
            Please log in or continue as guest to get started.
          </p>

          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
         <div className="d-flex flex-column flex-md-row justify-content-center gap-3 w-100">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary btn-lg flex-fill"
            >
               Log In
            </button>

            <button
              className="btn btn-outline-success btn-lg flex-fill fw-semibold px-2"
              type="button"
              onClick={handleGuest}
              style={{
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              Continue as Guest
            </button>
          </div>

          </div>
        </>
      )}
    </div>
  );
}

export default Home;
