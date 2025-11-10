import React, { useState } from "react";
import { authService } from "../../services/authService";
import AdminModel from "./AdminModel";

export default function UserList({ users, deleteUser }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAction, setModalAction] = useState("");

  const openModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
  };

  const handleConfirm = () => {
    if (!selectedUser) return;

    if (modalAction === "delete") deleteUser(selectedUser.id);
    if (modalAction === "verify") authService.adminVerifyUser(selectedUser.id);
    if (modalAction === "promote") authService.promoteToAdmin(selectedUser.id);
    if (modalAction === "deactivate") authService.deactivateUser(selectedUser.id);
    if (modalAction === "activate") authService.activateUser(selectedUser.id);
    if (modalAction === "reset") {
      const newPass = document.getElementById("newPass").value;
      authService.adminResetPassword(selectedUser.id, newPass);
    }

    window.location.reload();
  };

  return (
    <>
      <h2 className="fw-bold mb-4">
        <i className="bi bi-people me-2"></i> Manage Users
      </h2>

      <div className="card shadow-sm">
        <div className="card-body">

          {users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <ul className="list-group">

              {users.map((u) => (
                <li
                  key={u.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{u.email}</strong>
                    <br />
                    <small className="text-muted">
                      Role: {u.role} |{" "}
                      {u.emailVerified ? "Verified " : "Unverified "} |{" "}
                      {u.disabled ? "Inactive " : "Active "}
                    </small>
                  </div>

                  <div className="d-flex gap-2">

                    {/* Verify email */}
                    {!u.emailVerified && (
                      <button
                        className="btn btn-success btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#adminModel"
                        onClick={() => openModal(u, "verify")}
                      >
                        Verify
                      </button>
                    )}

                    {/* Activate / Deactivate */}
                    {u.role !== "admin" && (
                      <button
                        className="btn btn-warning btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#adminModel"
                        onClick={() => openModal(u, u.disabled ? "activate" : "deactivate")}
                      >
                        {u.disabled ? "Activate" : "Deactivate"}
                      </button>
                    )}

                    {/* Promote */}
                    {u.role !== "admin" && (
                      <button
                        className="btn btn-info btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#adminModel"
                        onClick={() => openModal(u, "promote")}
                      >
                        Make Admin
                      </button>
                    )}

                    {/* Reset password */}
                    <button
                      className="btn btn-secondary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#resetPassModal"
                      onClick={() => setSelectedUser(u)}
                    >
                      Reset Password
                    </button>

                    {/* Delete */}
                    {u.role !== "admin" && (
                      <button
                        className="btn btn-danger btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#adminModel"
                        onClick={() => openModal(u, "delete")}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}

            </ul>
          )}

        </div>
      </div>

      {/* General confirm modal */}
      <AdminModel
        id="adminModel"
        title={`Confirm ${modalAction}`}
        onConfirm={handleConfirm}
      >
        {selectedUser && (
          <p>
            Are you sure you want to <strong>{modalAction}</strong> user:
            <br />
            <strong>{selectedUser.email}</strong>?
          </p>
        )}
      </AdminModel>

      {/* Password reset modal */}
      <div className="modal fade" id="resetPassModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Reset Password</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <label className="form-label">New password</label>
              <input id="newPass" className="form-control" type="text" />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  authService.adminResetPassword(
                    selectedUser.id,
                    document.getElementById("newPass").value
                  );
                  window.location.reload();
                }}
                data-bs-dismiss="modal"
              >
                Reset
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
