import React from "react";


// since we have multiple pages where we want to implement a popup with a response, we create one component that can
// be reused by all the pages we want it in. Initially we had the simple alert that gave a response, but it improve 
// UX we create and use a modal 
export default function ResponseModal({ title, message, type = "success", onClose, onConfirm, showConfirm = false}){
    if(!message) return null;

    const headerClass = // check wether or not the response is successful, appropriate visuals given 
    type === "success" ? "bg-success text-white"
    : type === "danger" || type === "error" ? "bg-danger text-white"
    : "bg-primary text-white";

    return ( // we add a darekened backdrop to make the popup seem "over" the page
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`modal-header${headerClass}`}>
                        <h5 className="modal-title">{title}</h5>
                        <button
                        onClick={onClose}
                        className="btn-close btn-close-white"></button>
                    </div>

                    <div className="modal-body text-center py-4">
                        <p className="mb-0 fs-5">{message}</p>
                    </div>

                    <div className="modal-footer">
                        {showConfirm && (
                            <button className="btn btn-danger"
                            onClick={onConfirm}>
                                Delete
                            </button>
                        )}

                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}