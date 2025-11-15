import React, {useNavigate } from "react-router-dom";
import {useState} from "react";
import { authService } from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const navigate = useNavigate();

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
      setMsg(`Reset token generated!`);
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
      setMsg("Password updated");

      setTimeout(() => {navigate("/login");}, 1500);
    } catch (err){
      setErr(err.message);
    }
  };



  return (
    <div className="container py-5">

      {/* Modal for entering email, suggested and follwed ai instructions to set this up*/}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
              </div>

              <div className="modal-body">
                {err && <div className="alert alert-danger py-2">{err}</div>}
                <p> Enter email to receive reset token</p>
                <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={sendToken}>
                  Send token
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h3 className="mb-3 text-center">Reset Password</h3>

              {msg && <div className="alert alert-success">{msg}</div>}
              {err && <div className="alert alert-danger">{err}</div>}

              {stage === "reset" && (
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
                    <label className="form-label"> New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      required/>
                  </div>

                  <button className="btn btn-primary w-100" type="submit">
                    Reset Password
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}