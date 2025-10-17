//src/components/User/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false}) {

  const {isAuthenticated, account} = useSelector((state)=> state.user);


  if(!isAuthenticated){
    return <Navigate to="/login" replace/>;
  }

  if (requireAdmin && account.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}
