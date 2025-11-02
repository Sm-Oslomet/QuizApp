import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { authService } from "../../api/authService"; 
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setErr("");

    try {
      authService.login({ username, password });
      navigate("/select"); //går til quizen etter login
    } catch (error) {
      setErr(error.message || "Login failed");
    }
  };

  const handleGuest = () => {
    authService.guestLogin();
    navigate("/select"); // ✅ gjest får også tilgang
  };

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center text-primary mb-4">Login</h2>

      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={handleLogin} className="card shadow p-4">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            type="password"
            required
          />
        </div>

        <button className="btn btn-primary w-100 mb-2" type="submit">
          Log in
        </button>

        <button
          className="btn btn-outline-secondary w-100"
          type="button"
          onClick={handleGuest}
        >
          Continue as Guest
        </button>
      </form>

      <div className="text-center mt-3">
        <small>
          Don’t have an account? <Link to="/register">Create one</Link>
        </small>
      </div>
    </div>
  );
}

export default Login;
