import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "./AuthService"; 

function RequireAuth({ children }) {
  const user = authService.getCurrentUser();
  const location = useLocation();

  // Hvis ingen bruker er logget inn (verken gjest eller vanlig)
  if (!user) {
    // Send til login, men husk hvor de prøvde å gå
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ellers: tillat tilgang
  return children;
}

export default RequireAuth;
