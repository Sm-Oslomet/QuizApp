import React from "react";

export default function AdminModel({ id, title, children, onConfirm }) {
  return (
    <div className="modal fade" id={id} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
