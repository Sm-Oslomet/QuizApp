import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav
      className="navbar navbar-expand-lg bg-transparent border-bottom"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div className="container">
        {/* Logo / navn */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          QuizApp
        </Link>

        {/* Mobil-knapp */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigasjonslenker */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active text-primary" : "text-dark"
                }`}
                to="/"
              >
                Hjem
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/create"
                    ? "active text-primary"
                    : "text-dark"
                }`}
                to="/create"
              >
                Lag Quiz
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/select"
                    ? "active text-primary"
                    : "text-dark"
                }`}
                to="/select"
              >
                Quizer
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
