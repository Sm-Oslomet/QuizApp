import React from "react";

export default function DashboardHome({ users, quizzes }) {
  return (
    <>
      <h2 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2"></i>Dashboard Overview
      </h2>

      <div className="row g-4">

        <div className="col-md-4">
          <div className="card shadow-sm text-center p-4">
            <h2 className="fw-bold">{users.length}</h2>
            <p className="text-muted mb-0">Total Users</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm text-center p-4">
            <h2 className="fw-bold">{quizzes.length}</h2>
            <p className="text-muted mb-0">Total Quizzes</p>
          </div>
        </div>
      </div>
    </>
  );
}
