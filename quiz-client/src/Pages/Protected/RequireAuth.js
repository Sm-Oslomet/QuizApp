import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/authService"; 

export default function RequireAuth({ children }) {
  const user = authService.getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;
  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  return children;
}
