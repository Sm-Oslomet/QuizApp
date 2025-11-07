import React from "react";
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="container text-center py-5">
      <h2 className="text-danger">Access Denied</h2>
      <p className="text-muted">You do not have permission to view this page.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go Home
      </Link>
    </div>
  );
}
