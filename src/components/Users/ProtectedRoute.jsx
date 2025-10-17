// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, requireAdmin = false }) {
//   const user = useSelector((state) => state.user);

//   if (!user.isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requireAdmin && user.role?.toLowerCase() !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }
export default function ProtectedRoute({ children }) {
  return children;
}