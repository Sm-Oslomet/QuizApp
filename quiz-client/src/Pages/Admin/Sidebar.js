import React from "react";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ active, onChange }) {
  const navigate = useNavigate();

  const menuItem = (key, label, icon) => (
    <button
      className={
        "btn w-100 text-start mb-2 " +
        (active === key ? "btn-primary" : "btn-outline-light")
      }
      onClick={() => onChange(key)}
    >
      <i className={`bi ${icon} me-2`}></i>
      {label}
    </button>
  );

  return (
    <div
      className="bg-dark text-white p-4 shadow-sm"
      style={{ width: "250px" }}
    >
      <h4 className="fw-bold mb-4">Admin Panel</h4>

      {menuItem("home", "Dashboard Home", "bi-speedometer2")}
      {menuItem("users", "Users", "bi-people")}
      {menuItem("quizzes", "Quizzes", "bi-list-check")}

      <button
        className="btn btn-danger w-100 mt-4"
        onClick={() => {
          authService.logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
