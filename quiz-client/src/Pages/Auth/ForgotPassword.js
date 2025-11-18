import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false); // a modal for a cleaner ux when a password is reset
  const [stage, setStage] = useState("email");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [showModal, setShowModal] = useState(true);


// logic to send reset token ( for forgot password)
  const sendToken = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      const res = await authService.forgotPassword(email.trim().toLowerCase());
      setMsg("Reset token generated!");
      setToken(res.token);
      setStage("reset");
      setShowModal(false); // close modal
    } catch (err) {
      setErr(err.message || "Email does not exist");
    }
  };


  // logic to reset password

  const reset = async (e) =>{
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await authService.resetPassword(token, newPass);
      
      setShowSuccess(true);

      setTimeout(() => {navigate("/login");}, 1500);
    } catch (err){
      setErr(err.message);
    }
  };


return (
    <div className="container py-5">

      {showSuccess && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
              </div>

              <div className="modal-body">
                <p>Password has been updated</p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Modal for entering email, suggested and followed ai instructiions to set this up*/}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
              </div>

              <div className="modal-body">
                {err && <div className="alert alert-danger py-2">{err}</div>}

                <p>Enter your email to receive a reset token</p>

                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => navigate("/login")}>
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={sendToken}>
                  Send Token
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* RESET password section, Got errors due to mistamtch with the brackets and had to copy paste this 
      codf from a text helper, input my code, got the right bracket placements and copy pasted it back in here */}
      {!showSuccess && !showModal && stage === "reset" && (
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body p-4">

                <h3 className="text-center">Reset Password</h3>

                <form onSubmit={reset}>
                  <div className="mb-3">
                    <label className="form-label">Reset Token</label>
                    <input
                      className="form-control"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      required
                    />
                  </div>

                  <button className="btn btn-primary w-100" type="submit">
                    Reset Password
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}