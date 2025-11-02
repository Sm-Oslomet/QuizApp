import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../api/authService"; 

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setErr("");

    try {
      authService.register({ username, password });
      navigate("/select");
    } catch (error) {
      setErr(error.message || "Registration failed");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center text-primary mb-4">Create Account</h2>

      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={handleRegister} className="card shadow p-4">
        <div className="mb-3">
          <label className="form-label">Choose a username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="user name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Choose a password</label>
          <input
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••"
            type="password"
            required
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          Register
        </button>
      </form>

      <div className="text-center mt-3">
        <small>
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </small>
      </div>
    </div>
  );
}

export default Register;
