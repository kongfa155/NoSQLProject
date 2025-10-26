import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import contributedService from "../../services/contributedService";

const AdminReviewContributed = () => {
  const { id } = useParams();
  const { account } = useSelector((state) => state.user);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAction = useCallback(
    async (action, successMsg, errorMsg) => {
      try {
        if (action === "approve") {
          await contributedService.approve(id, {
            headers: { Authorization: `Bearer ${account.accessToken}` },
          });
        } else if (action === "reject") {
          await contributedService.reject(id, {
            headers: { Authorization: `Bearer ${account.accessToken}` },
          });
        }
        alert(successMsg);
        navigate("/donggopde");
      } catch (err) {
        console.error(err);
        alert(errorMsg || "Đã xảy ra lỗi!");
      }
    },
    [id, navigate, account?.accessToken]
  );

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await contributedService.getDetail(id);
        setQuiz(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải đề:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-8 text-xl text-gray-600">
        ⏳ Đang tải đề...
      </div>
    );

  if (!quiz)
    return (
      <div className="text-center py-8 text-xl text-red-500">
        Không tìm thấy đề đóng góp.
      </div>
    );

  return (
    <div className="max-w-[900px] mx-auto p-6 sm:p-4 pb-[60px] bg-gray-50 rounded-xl shadow-md">
      {/* Thông tin đề */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm leading-relaxed">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          📘 {quiz.name}
        </h2>
        <p>
          👤 Người đóng góp: <b>{quiz.author?.name || "Ẩn danh"}</b>
        </p>
        <p>
          🧩 Số câu hỏi: <b>{quiz.questions.length}</b>
        </p>
        <p>
          📅 Ngày gửi: {new Date(quiz.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {quiz.questions.map((q, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-5 rounded-xl mb-5 shadow-sm"
          >
            <p className="text-lg font-medium mb-2">
              <b>
                {i + 1}. {q.question}
              </b>
            </p>

            {q.image && (
              <div className="text-center my-2">
                <img
                  src={q.image.startsWith("http") ? q.image : `/${q.image}`}
                  alt={`Question ${i + 1}`}
                  className="w-[80%] max-w-[500px] rounded-lg shadow-lg"
                />
              </div>
            )}

            <ul className="list-none p-0 m-0">
              {q.options.map((opt, idx) => (
                <li
                  key={idx}
                  className={`p-2 sm:px-3 mb-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors ${
                    opt === q.answer
                      ? "bg-[#d4f8d4] border-[#44c767] text-[#2b6d2b] font-medium hover:bg-[#d4f8d4]"
                      : ""
                  }`}
                >
                  {opt} {opt === q.answer && "✅"}
                </li>
              ))}
            </ul>

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

      {/* Nút hành động */}
      <div className="flex justify-center gap-5 mt-6">
        <button
          className="py-3 px-7 text-base font-semibold rounded-lg bg-[#4caf50] text-white hover:bg-[#45a049] transition-all duration-200"
          onClick={() =>
            handleAction("approve", "✅ Đã duyệt đề!", "Lỗi khi duyệt!")
          }
        >
          ✅ Duyệt
        </button>
        <button
          className="py-3 px-7 text-base font-semibold rounded-lg bg-[#f44336] text-white hover:bg-[#e53935] transition-all duration-200"
          onClick={() =>
            handleAction("reject", "❌ Đã từ chối đề!", "Lỗi khi từ chối!")
          }
        >
          ❌ Từ chối
        </button>
      </div>
    </div>
  );
};

export default AdminReviewContributed;
