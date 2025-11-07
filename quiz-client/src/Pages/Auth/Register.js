import React, { useState } from "react";
import { authService } from "../../services/AuthService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(true);

  const [error, setError] = useState("");
  const [warn, setWarn] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setWarn("");

    if (password.length < 6) {
      setWarn("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setWarn("Passwords do not match.");
      return;
    }

    try {
      authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        remember,
      });

      navigate("/verify-email");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="mb-4 text-center">Create Account</h3>

              {error && <div className="alert alert-danger">{error}</div>}
              {warn && <div className="alert alert-warning">{warn}</div>}

              <form onSubmit={handleSubmit}>

                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
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

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>

                {/* Remember me */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="remember"
                    className="form-check-input"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button className="btn btn-success w-100" type="submit">
                  Register
                </button>
              </form>

              <div className="text-center mt-3">
                <small>
                  Already have an account? <Link to="/login">Log in</Link>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
