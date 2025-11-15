import React, {useState } from "react";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">You are not logged in.</div>
      </div>
    );
  }

  const verify = async () => {
    setErr("");
    setMsg("");

    try {
      await authService.verifyEmail(user.email);
      setMsg("Email verified");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h3 className="mb-3">Verify Your Email</h3>
              <p className="text-muted">Email: <strong>{user.email}</strong></p>

              {msg && <div className="alert alert-success">{msg}</div>}
              {err && <div className="alert alert-danger">{err}</div>}

              <button className="btn btn-primary w-100" onClick={verify}>Verify Now</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
