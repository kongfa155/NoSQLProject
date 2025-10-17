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
// import { useSelector } from "react-redux";

// export default function AdminPage() {
//   const { isAuthenticated, account } = useSelector((state) => state.user);

//   if (!isAuthenticated) {
//     return <div>Bạn chưa đăng nhập.</div>;
//   }

//   if (account.status !== "active") {
//     return <div>Tài khoản của bạn hiện đang bị khóa hoặc chưa kích hoạt.</div>;
//   }

//   return (
//     <div>
//       <h1>Xin chào, {account.username}</h1>
//       <p>Vai trò: {account.role}</p>
//       <p>Trạng thái: {account.status}</p>
//     </div>
//   );
// }
