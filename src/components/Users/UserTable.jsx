import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import userService from "../../services/userService"; // ✅ Dùng service chuẩn

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
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
    active: true,
  });

  const itemsPerPage = 8;
  const account = useSelector((state) => state.user.account);

  // 🔍 Lọc user theo tên/email
  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, totalPages, slicedItems } = Paginate(
    filtered,
    page,
    itemsPerPage
  );

  // 🗑️ Xóa user (thực ra là toggle trạng thái)
  const handleDelete = async (id) => {
    try {
      await userService.toggleStatus(id);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, active: !u.active } : u))
      );
      setDeletingUser(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đổi trạng thái user!");
    }
  };

  // ✏️ Cập nhật user
  const handleUpdate = async () => {
    try {
      const payload = {
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
        active: editingUser.active,
      };
      if (editingUser.password) payload.password = editingUser.password;

      const { data } = await userService.update(editingUser._id, payload);

      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? data : u))
      );
      setEditingUser(null);
      alert("Cập nhật user thành công!");
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật user!");
    }
  };

  // ➕ Thêm user
  const handleAdd = async () => {
    const { username, email, password, confirmPassword, role, active } =
      newUser;

    if (!username || !email || !password || !confirmPassword) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    try {
      const { data } = await userService.create({
        username,
        email,
        password,
        role,
        active,
      });
      setUsers((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
        active: true,
      });
      alert("Thêm user thành công!");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) alert(err.response.data.message);
      else alert("Có lỗi xảy ra khi thêm user!");
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
            className="bg-[#5DC254] text-white px-3 py-1 rounded-sm text-sm hover:bg-[#41563F] transition"
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
              <td className="py-2">{u.username}</td>
              <td>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                    u.active
                      ? "text-green-700 bg-green-100 border-green-400"
                      : "text-orange-700 bg-orange-100 border-orange-400"
                  }`}
                >
                  {u.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{u.role}</td>
              <td>{u.email}</td>
              <td className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#5DC254] text-[#5DC254] bg-white hover:bg-[#5DC254]/10 transform hover:scale-110 transition-all duration-200"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingUser(u)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500 text-red-500 bg-white hover:bg-red-500/10 transform hover:scale-110 transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
                placeholder="Username"
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, username: e.target.value })
                }
              />
              <input
                className="border px-3 py-2 w-full rounded-md mb-3"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Mật khẩu mới (nếu đổi)"
                className="border px-3 py-2 w-full rounded-md mb-3"
                value={editingUser.password || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, password: e.target.value })
                }
              />
              <select
                className="border px-3 py-2 w-full rounded-md mb-4"
                value={editingUser.active ? "true" : "false"}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    active: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <select
                className="border px-3 py-2 w-full rounded-md mb-4"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
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
                  className="px-4 py-2 bg-[#5DC254] text-white rounded-md hover:bg-green-700"
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
                Đổi trạng thái người dùng?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Bạn có chắc muốn đổi trạng thái của{" "}
                <span className="font-semibold">{deletingUser.username}</span>?
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
                  Xác nhận
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
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg w-96"
            >
              <h2 className="text-lg font-semibold mb-4">
                Thêm người dùng mới
              </h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Tên người dùng"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
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
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  className="border rounded-md px-3 py-2 text-sm"
                  value={newUser.confirmPassword}
                  onChange={(e) =>
                    setNewUser({ ...newUser, confirmPassword: e.target.value })
                  }
                />
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
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
                  className="px-3 py-1 text-sm bg-[#5DC254] text-white rounded-md hover:bg-[#41563F]"
                >
                  Thêm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
