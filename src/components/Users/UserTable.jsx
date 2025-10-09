// src/components/UserTable.jsx
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🧩 Tạo hàm Paginate thủ công
function Paginate(items, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const slicedItems = items.slice(start, start + itemsPerPage);
  return { currentPage, totalPages, slicedItems };
}

export default function UserTable({ users, setUsers }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "User", status: "Active" });


  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, totalPages, slicedItems } = Paginate(filtered, page, itemsPerPage);

  const deleteUser = (id) => setUsers(users.filter((u) => u.id !== id));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Danh sách tài khoản <span className="text-gray-500 ml-2">({filtered.length})</span>
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm user..."
            className="border rounded-md px-3 py-1 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
       <button onClick={() => setShowAddModal(true)}
           className="bg-[#6EA269] text-white px-3 py-1 rounded-sm text-sm 
          hover:bg-[#41563F] hover:text-black transition">
        + Thêm user
        </button>

        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="py-2">Name</th>
            <th>Status</th>
            <th>Role</th>
            <th>Email</th>
            <th className="text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {slicedItems.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{u.name}</td>
              <td>{u.status}</td>
              <td>{u.role}</td>
              <td>{u.email}</td>
              <td className="text-right space-x-2">
                 <button onClick={() => setEditingUser(u)}
                    className="text-[#6EA269] hover:text-green-900">
                      <Pencil size={16} />
                  </button>

               <button onClick={() => setDeletingUser(u)} // mở modal xác nhận
                  className="text-red-600 hover:text-red-800">
                   <Trash2 size={16} />
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="text-sm text-gray-500 hover:text-gray-800 
          hover:bg-[#6EA269] transition-opacity duration-200
           disabled:opacity-50 disabled:hover:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-sm">
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="text-sm text-gray-500 hover:text-gray-800
           hover:bg-[#6EA269] transition-opacity duration-200
           disabled:opacity-50 disabled:hover:opacity-50"
        >
          Next →
        </button>
      </div>

         <AnimatePresence> 
  {editingUser && (// Bảng cập nhật thông tin người dùng
    <motion.div
      key="modal-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={() => setEditingUser(null)} // click ra ngoài để đóng
    >
      <motion.div
        key="modal-content"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white p-6 rounded-2xl w-[400px] shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // tránh tắt modal khi bấm trong khung
      >
        <h3 className="text-xl font-semibold mb-4 text-center text-[#2f3e2f]">
          Cập nhật user
        </h3>

        <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          className="border px-3 py-2 w-full rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-[#6EA269]/50"
          value={editingUser.name}
          onChange={(e) =>
            setEditingUser({ ...editingUser, name: e.target.value })
          }
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="border px-3 py-2 w-full rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-[#6EA269]/50"
          value={editingUser.email}
          onChange={(e) =>
            setEditingUser({ ...editingUser, email: e.target.value })
          }
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
        <select
          className="border px-3 py-2 w-full rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#6EA269]/50"
          value={editingUser.role}
          onChange={(e) =>
            setEditingUser({ ...editingUser, role: e.target.value })
          }
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <div className="flex justify-between">
          <button
            onClick={() => setEditingUser(null)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              setUsers(users.map(u =>
                u.id === editingUser.id ? editingUser : u
              ));
              setEditingUser(null);
            }}
            className="px-4 py-2 bg-[#6EA269] text-white rounded-md hover:bg-green-700 transition"
          >
            Lưu
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <AnimatePresence>
  {deletingUser && ( //Xóa user
    <motion.div
      key="delete-modal-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={() => setDeletingUser(null)}
    >
      <motion.div
        key="delete-modal-content"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white p-6 rounded-2xl w-[350px] shadow-lg relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Xóa người dùng?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Bạn có chắc muốn xóa <span className="font-semibold">{deletingUser.name}</span>?
          <br />Hành động này không thể hoàn tác.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setDeletingUser(null)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Hủy
          </button>
         <button onClick={() => {setUsers(users.map(u =>
        u.id === deletingUser.id ? { ...u, status: "Inactive" } : u
        )
      );
    setDeletingUser(null);
    }}
      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition">
          Inactive
</button>

        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
<AnimatePresence>
      {showAddModal && (
    <motion.div //Thêm user
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Thêm người dùng mới</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Tên người dùng"
            className="border rounded-md px-3 py-2 text-sm"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded-md px-3 py-2 text-sm"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option>User</option>
            <option>Admin</option>
          </select>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (!newUser.name || !newUser.email) {
                alert("Vui lòng nhập đủ thông tin!");
                return;
              }

              const id = users.length ? users[users.length - 1].id + 1 : 1;
              setUsers([...users, { id, ...newUser }]);
              setShowAddModal(false);
              setNewUser({ name: "", email: "", role: "User", status: "Active" });
            }}
            className="px-3 py-1 text-sm bg-[#6EA269] text-white rounded-md hover:bg-[#41563F]"
          >
            Thêm
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}
