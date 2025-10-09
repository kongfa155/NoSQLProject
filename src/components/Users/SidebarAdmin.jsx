import { Home, Users, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SidebarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🧹 (tuỳ chọn) Xóa dữ liệu đăng nhập trong localStorage/sessionStorage nếu có
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");

    navigate("/"); // 👉 chuyển về trang chủ
  };

  return (
    <aside className="w-60 bg-[#6EA269] text-white flex flex-col justify-between">
      <div>
        <div className="p-4 text-2xl font-bold tracking-wide">QUIZZES</div>

        <nav className="mt-4 flex flex-col">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 hover:bg-[#41563F] rounded-md transition-colors text-white hover:text-black"
          >
            <Home size={18} />
            Trang chủ
          </Link>

          <Link
            to="/admin"
            className="flex items-center gap-3 p-3 hover:bg-[#41563F] rounded-md transition-colors text-white hover:text-black"
          >
            <Users size={18} />
            Quản lí user
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center gap-3 p-3 hover:bg-[#41563F] rounded-md transition-colors text-white hover:text-black"
          >
            <Settings size={18} />
            Cài đặt
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-green-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full hover:bg-[#41563F] p-2 transition-colors hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
