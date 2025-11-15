import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Auto admin credentials 
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("admin") === "true") {
      setEmail("admin@quiz.com");
      setPassword("admin123");
      setRemember(true);
    }
  }, [location]);

  // If already logged in, show logout inside login page
  const currentUser = authService.getCurrentUser();

  // changed previous handleSubmit

  const handleSubmit = async (e) => {
     e.preventDefault();
     setError("");
     try{
      const loggedIn = await authService.login({
        email: email.trim().toLowerCase(),
        password,
        remember,
      });
      if(loggedIn.role === "admin"){
        navigate("/admin");
      }
      else {navigate("/");}
     }
     catch (err) {setError(err.message||"Login failed!");}
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="mb-4 text-center">Log In</h3>

              {error && <div className="alert alert-danger">{error}</div>}

              {/*If logged in, show logout + skip login form */}
              {currentUser ? (
                <div className="text-center">
                  <p className="mb-3">
                    You are already logged in as <strong>{currentUser.email}</strong>
                  </p>
                  <button className="btn btn-danger w-100" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  {/* Login Form */}
                  <form onSubmit={handleSubmit}>
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
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

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

                    <button className="btn btn-primary w-100" type="submit">
                      Log In
                    </button>

                    <div className="text-center mt-3">
                      <button 
                      type="button"
                      className="btn btn-link"
                      onClick={() => navigate("/forgot-password")}>
                        Forgot PAssword?
                      </button>
                    </div>
                  </form>

                  {/* Register button */}
                  <div className="mt-4">
                    <button
                      onClick={() => navigate("/register")}
                      className="btn btn-outline-success w-100"
                    >
                      Create a New Account
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
