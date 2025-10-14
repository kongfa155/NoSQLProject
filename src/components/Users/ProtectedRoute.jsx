//src/components/User/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && role !== "Admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}
