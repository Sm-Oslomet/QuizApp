import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("token"); // Even though we moved away from localstorage with our user and quiz data, we still us eit to store jwt tokens.
  const role = localStorage.getItem("role");


  if (!token) return <Navigate to="/login"/>;
  if (role !== "Admin") return <Navigate to="/not-authorized" />;

  return <Outlet />;
}
