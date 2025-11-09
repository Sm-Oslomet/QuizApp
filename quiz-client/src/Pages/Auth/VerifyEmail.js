import React from "react";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">You are not logged in.</div>
      </div>
    );
  }

  const verify = () => {
    authService.verifyEmail();
    navigate("/select");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h3 className="mb-3">Verify Your Email</h3>
              <p className="text-muted">Email: <strong>{user.email}</strong></p>

              {!user.emailVerified ? (
                <button className="btn btn-primary w-100" onClick={verify}>
                  Verify Now
                </button>
              ) : (
                <div className="alert alert-success text-center">Already Verified ✅</div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
