import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import quizService from "../api/quizService";
import { useEffect, useState} from "react";


export default function Home() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const user = authService.getCurrentUser();

  const greetingName = user?.guest
    ? "Guest"
    : user?.name || user?.email?.split("@")[0] || "User";

  /* (Had a critical error that get sending GET requests non stop, had to use AI to fix, 
  inserted code and got the fixed version. Only changes were specifically what caused the break, 
  nothing else was changed. FIX: remove user from dependency array to stop infinite re-renders */
  useEffect(() => {
    if (user && !user.guest) {
      quizService.getMyAttempts()
        .then(data => setAttempts(data))
        .catch(err => console.error("failed to load attempts:", err));
    }
  }, []); // <--- FIXED

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

            {!user?.guest && ( // button only avaliable to logged in users, guest users can't create new quizzes
              <div className="col-12 col-md-5">
                <button
                  onClick={() => navigate("/create")}
                  className="btn btn-primary btn-lg w-100"
                >
                 Create a New Quiz
                </button>
              </div>
            )}
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
          {/* We add logic for users to verify their email, while logged in, if they have not done so. also a check to see if the */}
          {user && !user.guest && !user.isVerified && (
            <div className="alert alert-warning rext-center mb-3">
              Email not verified
              <Link to="/verify-email" className="alert-link ms-2"> Verify email</Link>
            </div>
          )}
          <ButtonsBlock />
        </div>
      </div>

      {user && !user.guest && ( // display for user's quiz history, only applicable to users and not guests
        <div className="mt-5">
          <h3 className="fw-semibold mb-3">Quiz history</h3>

          {/* FIX: attempts.length typo */}
          {attempts.length === 0 ? (
            <p className="text-muted">No quiz completions</p>
          ) : (
            <div className="list-group">
              {attempts.map(a => (
                <div 
                  key={a.attemptId}
                  className="list-group-item list-group-item-action mb-2 shadow-sm"
                  style={{ borderRadius: "8px" }}
                >
                  {/* FIX: alighn-items-center → align-items-center */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">{a.quizTitle}</h5>
                      <small className="text-muted">
                        {new Date(a.attemptedAt).toLocaleString()}
                      </small>
                    </div>

                    {/* FIX: classname → className, totalQuesitons → totalQuestions */}
                    <span className="badge bg-primary rounded-pill">
                      {a.score}/{a.totalQuestions}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
