import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/AuthService";

export default function AdminRoute({ children }) {
  const user = authService.getCurrentUser();

  // Hvis ikke innlogget eller ikke admin → nekt tilgang
  if (!user || !user.isAdmin) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Admin → gi tilgang
  return children;
}
