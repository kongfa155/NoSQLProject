import SidebarAdmin from "../../components/Users/SidebarAdmin";
import NavbarAdmin from "../../components/Users/NavbarAdmin";

export default function SettingPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main content */}
      <div className="flex-1">
        <NavbarAdmin />
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-green-800 mb-4">
            Cài đặt hệ thống
          </h1>
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700">
              Đây là trang cài đặt. Bạn có thể chỉnh sửa thông tin tài khảon.. mốt có biết backend rồi tính.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
