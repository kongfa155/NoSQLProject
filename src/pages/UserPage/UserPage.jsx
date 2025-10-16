//src/page/UserPage/UserPage.jsx
export default function UserPage() {
  const name = localStorage.getItem("name") || "Người dùng";

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">Xin chào, {name} 👋</h1>
      <p className="text-lg">Bạn đã đăng nhập thành công!</p>
      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
