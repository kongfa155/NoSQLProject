//src/components/User/UserTable.jsx
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axiosInstance"; // ✅ axios có token sẵn

// 🧩 Hàm chia trang
function Paginate(items, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const slicedItems = items.slice(start, start + itemsPerPage);
  return { currentPage, totalPages, slicedItems };
}

export default function UserTable({ users, setUsers }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    status: "Active",
  });

  const itemsPerPage = 8;

  // Lọc user theo tên/email
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, totalPages, slicedItems } = Paginate(
    filtered,
    page,
    itemsPerPage
  );

  // 🗑️ Xóa user
  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setDeletingUser(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa user!");
    }
  };

  // ✏️ Cập nhật user
  const handleUpdate = async () => {
    try {
      const { data } = await api.put(`/users/${editingUser._id}`, editingUser);
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? data : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật user!");
    }
  };

  // ➕ Thêm user
  const handleAdd = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    try {
      const { data } = await api.post("/users", newUser);
      setUsers((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewUser({ name: "", email: "", role: "user", status: "Active" });
    } catch (err) {
      console.error(err);
      alert("Không thể thêm user mới!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Danh sách tài khoản{" "}
          <span className="text-gray-500 ml-2">({filtered.length})</span>
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm user..."
            className="border rounded-md px-3 py-1 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#6EA269] text-white px-3 py-1 rounded-sm text-sm hover:bg-[#41563F] transition"
          >
            + Thêm user
          </button>
        </div>
      </div>

      {/* TABLE */}
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
            <tr key={u._id} className="border-b hover:bg-gray-50">
              <td className="py-2">{u.name}</td>
              <td>{u.status}</td>
              <td>{u.role}</td>
              <td>{u.email}</td>
              <td className="text-right space-x-2">
                <button
                  onClick={() => setEditingUser(u)}
                  className="text-[#6EA269] hover:text-green-900"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => setDeletingUser(u)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="text-sm text-gray-500 hover:text-gray-800 transition disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-sm">
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="text-sm text-gray-500 hover:text-gray-800 transition disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* ✏️ MODAL EDIT */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={() => setEditingUser(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl w-[400px] shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-center">
                Cập nhật user
              </h3>

              <input
                className="border px-3 py-2 w-full rounded-md mb-3"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />

              <input
                className="border px-3 py-2 w-full rounded-md mb-3"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />

              <select
                className="border px-3 py-2 w-full rounded-md mb-4"
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
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-[#6EA269] text-white rounded-md hover:bg-green-700"
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗑️ MODAL DELETE */}
      <AnimatePresence>
        {deletingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={() => setDeletingUser(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl w-[350px] shadow-lg text-center"
            >
              <h3 className="text-lg font-semibold mb-3">
                Xóa người dùng này?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Hành động này sẽ xóa vĩnh viễn{" "}
                <span className="font-semibold">{deletingUser.name}</span>.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeletingUser(null)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(deletingUser._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ➕ MODAL ADD */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">
                Thêm người dùng mới
              </h2>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Tên người dùng"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
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
                  onClick={handleAdd}
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
