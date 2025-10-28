import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "./Login/AuthService"; 

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* App name */}
        <Link className="navbar-brand fw-bold" to="/">
          QuizApp
        </Link>

        {/* Toggle for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active text-warning" : ""
                }`}
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/create" ? "active text-warning" : ""
                }`}
                to="/create"
              >
                Create Quiz
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/select" ? "active text-warning" : ""
                }`}
                to="/select"
              >
                Select Quiz
              </Link>
            </li>
            {/* User section */}
            {user ? (
              <>
                <li className="nav-item text-white me-3">
                  {user.guest
                    ? "Guest"
                    : `Logged in as ${user.username}`}
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/login"
                        ? "active text-warning"
                        : ""
                    }`}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/register"
                        ? "active text-warning"
                        : ""
                    }`}
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
