// src/pages/AdminPage/AdminPage.jsx
import SidebarAdmin from "../../components/Users/SidebarAdmin";
import NavbarAdmin from "../../components/Users/NavbarAdmin";
import UserTable from "../../components/Users/UserTable";
import { useEffect, useState } from "react";
// import api from "../../api/axiosInstance"; // axios đã có token
import userService from "../../services/userService"; // Xài thằng này thay cho API cũ
import { useSelector } from "react-redux";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const account = useSelector((state) => state.user.account);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await userService.getAll();
        setUsers(data);
      } catch (err) {
        console.error("Lỗi khi load danh sách user:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin />

      <div className="flex flex-col flex-1">
        <NavbarAdmin username={account?.username || "Admin"} />

        <main className="flex-1 p-6">
          <UserTable users={users} setUsers={setUsers} />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

