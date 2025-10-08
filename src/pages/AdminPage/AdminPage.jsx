// src/pages/AdminDashboard/AdminDashboard.jsx
import { useState } from "react";
import SidebarAdmin from "../../components/Users/SidebarAdmin";
import NavbarAdmin from "../../components/Users/NavbarAdmin";
import UserTable from "../../components/Users/UserTable";

function AdminDashboard() {
  const [users, setUsers] = useState([
    { id: 1, name: "Olivia Rhye", username: "@olivia", email: "olivia@untitledui.com", role: "Admin", status: "Active" },
    { id: 2, name: "Phoenix Baker", username: "@phoenix", email: "phoenix@untitledui.com", role: "User", status: "Active" },
    // ...
  ]);

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
