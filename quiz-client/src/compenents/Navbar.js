import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService"; 

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const displayName = user?.guest ? "Guest" : user?.name;

  const isActive = (path) =>
    location.pathname === path ? "active text-warning" : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        
        <Link className="navbar-brand fw-bold" to="/">
          QuizApp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Home */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/")}`} to="/">
                Home
              </Link>
            </li>

            {/* Logged-in */}
            {user ? (
              <>
                <li className="nav-item text-white me-3">
                  Logged in as {displayName}
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
                {/* Login */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/login" &&
                      !location.search.includes("admin=true")
                        ? "active text-warning"
                        : ""
                    }`}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                {/* Register */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/register")}`}
                    to="/register"
                  >
                    Register
                  </Link>
                </li>

                {/* Admin Login (ryddet) */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/login" &&
                      location.search.includes("admin=true")
                        ? "active text-warning"
                        : ""
                    }`}
                    to="/login?admin=true"
                  >
                    Admin Login
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
