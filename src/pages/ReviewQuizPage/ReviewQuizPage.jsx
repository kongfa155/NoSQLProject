import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import quizService from "../../services/quizService";
import submissionService from "../../services/submissionService";
import ReviewDrawer from "../../components/ReviewDrawer/ReviewDrawer";

export default function ReviewQuizPage() {
  // --- Redux ---
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const account = useSelector((state) => state.user.account);
  const userId = account?.id;

  // --- Router ---
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // --- State mode ---
  const initialMode = location.state?.mode || "latest"; // "latest" = lần làm gần nhất, "full" = xem toàn bộ
  const subjectId = location.state.subjectId;
  const [mode, setMode] = useState(initialMode);

  // --- Quiz & submission state ---
  const [quizInfo, setQuizInfo] = useState(null); // thông tin quiz
  const [questions, setQuestions] = useState([]); // danh sách câu hỏi
  const [submission, setSubmission] = useState(null); // dữ liệu lần làm gần nhất
  const [loading, setLoading] = useState(true);

  // --- Fetch quiz & submission ---
  useEffect(() => {
    if (!userId) return;
    const fetchQuizAndSubmission = async () => {
      setLoading(true);
      try {
        // Lấy quiz
        const quizRes = await quizService.getById(quizId);
        setQuizInfo(quizRes.data);
        setQuestions(quizRes.data.questions || []);

        // Lấy submission gần nhất
        const subRes = await submissionService.getLatest(quizId, userId);
        if (!subRes.data) {
          setSubmission(null);
          setMode("full"); // Nếu chưa làm => xem toàn bộ
        } else {
          setSubmission(subRes.data);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAndSubmission();
  }, [quizId, userId]);

  // --- Chưa đăng nhập / đang load / không tìm thấy quiz ---
  if (!isAuthenticated) return <div>Vui lòng đăng nhập để xem bài làm.</div>;
  if (loading) return <div>Đang tải dữ liệu bài kiểm tra...</div>;
  if (!quizInfo) return <div>Không tìm thấy bài kiểm tra.</div>;

  // --- Chuyển submission.answers thành object để dễ lookup ---
  const userAnswers =
    submission?.answers?.reduce((acc, ans) => {
      acc[ans.questionId.toString()] = ans.selectedOption;
      return acc;
    }, {}) || {};

  // --- Xác định class cho từng option ---
  const getOptionClass = (q, opt, userChoice) => {
    if (mode === "latest") {
      if (opt === q.answer)
        return "bg-green-100 border-green-500 text-green-800"; // đáp án đúng
      if (opt === userChoice && opt !== q.answer)
        return "bg-red-100 border-red-500 text-red-700"; // chọn sai
    } else if (mode === "full") {
      if (opt === q.answer)
        return "bg-green-100 border-green-500 text-green-800"; // xem toàn bộ => highlight đáp án đúng
    }
    return "bg-white border-gray-300 hover:bg-gray-100"; // mặc định
  };

  const labels = ["A", "B", "C", "D", "E", "F"]; // nhãn cho option

  return (
    <div className="w-1/2 mx-auto p-8 bg-gray-50 min-h-screen">
      {/* --- Tiêu đề quiz --- */}
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Xem lại: {quizInfo.name}
      </h2>

      {/* --- Thông tin lần làm gần nhất --- */}
      {submission && mode === "latest" && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-8 text-center">
          <p className="text-2xl">
            🎯 Điểm lần này:{" "}
            <span className="font-semibold text-[#3D763A]">
              {submission.score}%
            </span>
          </p>
          {submission.bestScore !== undefined && (
            <p className="text-gray-600 text-lg">
              🏆 Điểm cao nhất: {submission.bestScore}%
            </p>
          )}
          <p className="text-gray-600 text-lg">
            ⏱️ Thời gian làm: {Math.floor(submission.timeSpent / 60)} phút{" "}
            {submission.timeSpent % 60} giây
          </p>
        </div>
      )}

      {/* --- Danh sách câu hỏi --- */}
      {questions.map((q, idx) => {
        const questionIdStr = q._id.toString();
        const userChoice = userAnswers[questionIdStr];

        return (
          <div
            key={questionIdStr}
            id={`question-${idx + 1}`} // dùng để ReviewDrawer scroll
            className="mb-10 bg-white p-6 rounded-2xl shadow-sm scroll-mt-24"
          >
            <p className="text-xl font-semibold text-gray-800 mb-3">
              {idx + 1}. {q.question}
            </p>

            {/* --- Hình ảnh nếu có --- */}
            {q.image && (
              <div className="flex justify-center my-4">
                <img
                  src={
                    q.image.startsWith("http")
                      ? q.image
                      : `http://localhost:5000/${q.image}`
                  }
                  alt="Question"
                  className="max-w-[600px] rounded-xl shadow-md"
                />
              </div>
            )}

            {/* --- Options --- */}
            <ul className="space-y-3 list-none">
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 p-4 border rounded-xl transition-all duration-200 ${getOptionClass(
                    q,
                    opt,
                    userChoice
                  )} ${
                    userChoice === opt && mode === "latest"
                      ? "ring-2 ring-blue-400"
                      : ""
                  }`}
                >
                  <span className="font-semibold text-gray-600">
                    {labels[i]}.
                  </span>
                  <span>{opt}</span>
                </li>
              ))}
            </ul>

            {/* --- Giải thích --- */}
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <p className="font-semibold text-yellow-700">💡 Giải thích:</p>
              <p className="text-gray-700 mt-1">{q.explain}</p>
            </div>
          </div>
        );
      })}

      {/* --- Nút hoàn tất --- */}
      <div className="text-center mt-10">
        <button
          className="px-8 py-3 bg-[#3D763A] text-white rounded-lg hover:bg-[#2e5e2e] transition-all duration-300"
          onClick={() => navigate(`/subject/view/${subjectId}`)}
        >
          Hoàn tất việc xem lại
        </button>
      </div>

      {/* --- Drawer để điều hướng câu hỏi --- */}
      <ReviewDrawer totalQuestions={questions.length} />
    </div>
  );
}
