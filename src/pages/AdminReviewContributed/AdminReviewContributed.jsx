import { useEffect, useState, useCallback } from "react"; // React hook quản lý state, side-effect và tối ưu hàm
import { useParams, useNavigate } from "react-router-dom"; // Lấy params từ URL và điều hướng trang
import { useSelector } from "react-redux"; // Lấy dữ liệu từ Redux store
import contributedService from "../../services/contributedService"; // Service gọi API liên quan đến đề đóng góp

const AdminReviewContributed = () => {
  const { id } = useParams(); // Lấy id đề từ URL
  const { account } = useSelector((state) => state.user); // Lấy thông tin tài khoản hiện tại từ Redux
  const [quiz, setQuiz] = useState(null); // Lưu thông tin đề đóng góp
  const [loading, setLoading] = useState(true); // Trạng thái đang tải dữ liệu
  const navigate = useNavigate(); // Dùng để chuyển trang

  // Hàm xử lý duyệt hoặc từ chối đề
  const handleAction = useCallback(
    async (action, successMsg, errorMsg) => {
      try {
        if (action === "approve") {
          // Nếu chọn duyệt
          await contributedService.approve(id, {
            headers: { Authorization: `Bearer ${account.accessToken}` }, // Gửi token để xác thực
          });
        } else if (action === "reject") {
          // Nếu chọn từ chối
          await contributedService.reject(id, {
            headers: { Authorization: `Bearer ${account.accessToken}` },
          });
        }
        alert(successMsg); // Thông báo thành công
        navigate("/donggopde"); // Quay về trang danh sách đề đóng góp
      } catch (err) {
        console.error(err); // Log lỗi ra console
        alert(errorMsg || "Đã xảy ra lỗi!"); // Hiển thị thông báo lỗi
      }
    },
    [id, navigate, account?.accessToken] // useCallback chỉ thay đổi nếu id, navigate hoặc token thay đổi
  );

  // useEffect chạy khi component mount để tải dữ liệu đề
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await contributedService.getDetail(id); // Gọi API lấy chi tiết đề
        setQuiz(data); // Lưu dữ liệu vào state
      } catch (err) {
        console.error("Lỗi khi tải đề:", err); // Log lỗi nếu có
      } finally {
        setLoading(false); // Tắt trạng thái loading dù thành công hay lỗi
      }
    };
    fetchQuiz();
  }, [id]); // Chạy lại nếu id thay đổi

  // Hiển thị khi đang tải
  if (loading)
    return (
      <div className="text-center py-8 text-xl text-gray-600">
        ⏳ Đang tải đề...
      </div>
    );

  // Hiển thị nếu không tìm thấy đề
  if (!quiz)
    return (
      <div className="text-center py-8 text-xl text-red-500">
        Không tìm thấy đề đóng góp.
      </div>
    );

  // Render giao diện chính
  return (
    <div className="max-w-[900px] mx-auto p-6 sm:p-4 pb-[60px] bg-gray-50 rounded-xl shadow-md">
      {/* Thông tin đề */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          📘 {quiz.name} {/* Tên đề */}
        </h2>
        <p>
          👤 Người đóng góp: <b>{quiz.author?.name || "Ẩn danh"}</b>{" "}
          {/* Tên tác giả, nếu ẩn danh thì hiển thị "Ẩn danh" */}
        </p>
        <p>
          🧩 Số câu hỏi: <b>{quiz.questions.length}</b> {/* Số lượng câu hỏi */}
        </p>
        <p>
          📅 Ngày gửi: {new Date(quiz.createdAt).toLocaleDateString("vi-VN")}{" "}
          {/* Ngày tạo đề, format theo VN */}
        </p>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {quiz.questions.map((q, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-5 rounded-xl mb-5 shadow-sm"
          >
            {/* Nội dung câu hỏi */}
            <p className="text-lg font-medium mb-2">
              <b>
                {i + 1}. {q.question} {/* Số thứ tự và câu hỏi */}
              </b>
            </p>

            {/* Hình ảnh câu hỏi nếu có */}
            {q.image && (
              <div className="text-center my-2">
                <img
                  src={q.image.startsWith("http") ? q.image : `/${q.image}`} // Nếu link không bắt đầu bằng http thì thêm /
                  alt={`Question ${i + 1}`}
                  className="w-[80%] max-w-[500px] rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Các lựa chọn trả lời */}
            <ul className="list-none p-0 m-0">
              {q.options.map((opt, idx) => (
                <li
                  key={idx}
                  className={`p-2 sm:px-3 mb-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors ${
                    opt === q.answer
                      ? "bg-[#d4f8d4] border-[#44c767] text-[#2b6d2b] font-medium hover:bg-[#d4f8d4]" // Nếu đúng thì đổi màu nền, border và chữ
                      : ""
                  }`}
                >
                  {opt} {opt === q.answer && "✅"}{" "}
                  {/* Hiển thị check nếu là đáp án đúng */}
                </li>
              ))}
            </ul>

            {/* Giải thích nếu có */}
            {q.explain && (
              <div className="bg-[#fff6da] border-l-4 border-[#ffcc00] mt-2 sm:mt-3 p-3 sm:px-4 rounded-md">
                <span className="font-semibold text-[#b58900]">
                  💡 Giải thích:
                </span>
                <p className="mt-1 text-gray-600">{q.explain}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nút hành động duyệt hoặc từ chối */}
      <div className="flex justify-center gap-5 mt-6">
        <button
          className="py-3 px-7 text-base font-semibold rounded-lg bg-[#4caf50] text-white hover:bg-[#45a049] transition-all duration-200"
          onClick={
            () => handleAction("approve", "✅ Đã duyệt đề!", "Lỗi khi duyệt!") // Duyệt đề
          }
        >
          ✅ Duyệt
        </button>
        <button
          className="py-3 px-7 text-base font-semibold rounded-lg bg-[#f44336] text-white hover:bg-[#e53935] transition-all duration-200"
          onClick={
            () =>
              handleAction("reject", "❌ Đã từ chối đề!", "Lỗi khi từ chối!") // Từ chối đề
          }
        >
          ❌ Từ chối
        </button>
      </div>
    </div>
  );
};

export default AdminReviewContributed; // Xuất component để dùng ở file khác
