//scr/components/Users/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const user = useSelector((state) => state.user);

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user.account.role?.toLowerCase();

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
