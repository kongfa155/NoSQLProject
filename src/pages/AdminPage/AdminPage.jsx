// src/pages/AdminPage/AdminPage.jsx
import SidebarAdmin from "../../components/Users/SidebarAdmin";
import NavbarAdmin from "../../components/Users/NavbarAdmin";
import UserTable from "../../components/Users/UserTable";
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance"; // axios đã có token

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users"); // gọi API /users
        setUsers(data); // set vào state
        console.log("Thông tin users: ", data);
      } catch (err) {
        console.error("Lỗi khi load danh sách user:", err);
      }
    };

    fetchUsers(); // gọi khi component mount
  }, []); // [] = chỉ chạy 1 lần khi mount

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <NavbarAdmin username="Lệ Tổ" />

        <main className="flex-1 p-6">
          <UserTable users={users} setUsers={setUsers} />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
