// src/pages/AdminPage/AdminPage.jsx
import SidebarAdmin from "../../components/Users/SidebarAdmin";
import NavbarAdmin from "../../components/Users/NavbarAdmin";
import UserTable from "../../components/Users/UserTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`/api/users`) // xai GET o route /api/users
    .then(res=>{ // res la response tu phia backend
      console.log("Thong tin users: ", res.data); 
      setUsers(res.data);
    })
    .catch(err=>{ // err la loi
      console.log("err: ",err);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <NavbarAdmin username="Lệ Tổ"  />

        <main className="flex-1 p-6">
          <UserTable users={users} setUsers={setUsers} />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
