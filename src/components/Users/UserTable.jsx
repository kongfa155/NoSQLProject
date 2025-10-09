// src/components/UserTable.jsx
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";

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
          <button className="bg-green-700 text-white px-3 py-1 rounded-md text-sm hover:bg-green-800">
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
                <button className="text-green-700 hover:text-green-900">
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="text-red-600 hover:text-red-800"
                >
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
          className="text-sm text-gray-500 hover:text-gray-800 disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-sm">
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="text-sm text-gray-500 hover:text-gray-800 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
