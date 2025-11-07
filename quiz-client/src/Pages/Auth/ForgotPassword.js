import React, { useState } from "react";
import { authService } from "../../services/AuthService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      authService.resetPassword(email.trim().toLowerCase(), newPass);
      setMsg("Password updated successfully!");
    } catch (e) {
      setErr(e.message || "Failed to reset password");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h3 className="mb-3 text-center">Reset Password</h3>

              {msg && <div className="alert alert-success">{msg}</div>}
              {err && <div className="alert alert-danger">{err}</div>}

              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Update Password
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}