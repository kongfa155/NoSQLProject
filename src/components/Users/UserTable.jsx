import { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import userService from "../../services/userService";

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

  // NEW USER DEFAULT
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
    status: "normal", 
  });

  function getItemsPerPage() {
    if (typeof window === "undefined") return 8;

    const height = window.innerHeight;
    const width = window.innerWidth;

    if (width < 640) return 4;
    if (width < 1024) return 6;
    if (height < 800) return 7;
    return 9;
  }

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      const tableTopOffset = 280;
      const rowHeight = 48;
      const availableHeight = window.innerHeight - tableTopOffset;
      const visibleRows = Math.max(4, Math.floor(availableHeight / rowHeight));
      setItemsPerPage(visibleRows);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Toggle Banned/Normal
  const handleDelete = async (id) => {
    try {
      await userService.toggleStatus(id);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, status: u.status === "normal" ? "banned" : "normal" }
            : u
        )
      );

      setDeletingUser(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đổi trạng thái user!");
    }
  };

  // Update user
  const handleUpdate = async () => {
    try {
      const payload = {
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status,
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

  // Add user
  const handleAdd = async () => {
    const { username, email, password, confirmPassword, role } = newUser;

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
        status: "normal", 
      });

      setUsers((prev) => [...prev, data]);
      setShowAddModal(false);

      setNewUser({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
        status: "normal",
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
            className="bg-[#31872D] text-white px-3 py-1 rounded-sm text-sm hover:bg-[#41563F] transition"
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
                    u.status === "normal"
                      ? "text-green-700 bg-green-100 border-green-400"
                      : "text-red-700 bg-red-100 border-red-400"
                  }`}
                >
                  {u.status === "normal" ? "Active" : "Banned"}
                </span>
              </td>

              <td>{u.role}</td>
              <td>{u.email}</td>

              <td className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#31872D] text-[#31872D] bg-white hover:bg-[#31872D]/10 transform hover:scale-110 transition-all duration-200"
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

      {/* MODAL EDIT */}
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
                Cập nhật: <span className="text-[#31872D]">{editingUser.username}</span>
              </h3>


              <select
                className="border px-3 py-2 w-full rounded-md mb-4"
                value={editingUser.status}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    status: e.target.value,
                  })
                }
              >
                <option value="normal">Active</option>
                <option value="banned">Banned</option>
              </select>

              <select
                className="border px-3 py-2 w-full rounded-md mb-4"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    role: e.target.value,
                  })
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
                  className="px-4 py-2 bg-[#31872D] text-white rounded-md hover:bg-green-700"
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DELETE */}
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

      {/* MODAL ADD */}
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
              <h2 className="text-lg font-semibold mb-4">Thêm người dùng mới</h2>

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
                    setNewUser({
                      ...newUser,
                      confirmPassword: e.target.value,
                    })
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
                  className="px-3 py-1 text-sm bg-[#31872D] text-white rounded-md hover:bg-[#41563F]"
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
