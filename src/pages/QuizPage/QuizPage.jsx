import { useState, useEffect } from "react"; // React hook: state và side-effects
import { useParams, useLocation, useNavigate } from "react-router-dom"; // Router hook
import { useSelector } from "react-redux"; // Lấy dữ liệu từ Redux
import quizService from "../../services/quizService"; // API lấy quiz
import submissionService from "../../services/submissionService"; // API nộp bài
import QuestionDrawer from "../../components/QuestionDrawer/QuestionDrawer"; // Drawer bên phải show câu hỏi
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icon điều hướng
import { Button, Container } from "react-bootstrap"; // React-Bootstrap

export default function QuizPage() {
  const { quizId } = useParams(); // Lấy quizId từ URL
  const location = useLocation(); // Lấy state truyền từ trang trước
  const navigate = useNavigate(); // Điều hướng
  const account = useSelector((state) => state.user.account); // Lấy user hiện tại
  const userId = account?.id;

  // Nếu chưa đăng nhập
  if (!userId)
    return (
      <div className="text-center text-red-500 mt-10">
        Vui lòng đăng nhập để làm bài.
      </div>
    );

  // Quiz info từ location state hoặc default
  const quizInfo = location.state?.quiz || {
    name: "Kiểm tra nhanh Giới thiệu ngôn ngữ lập trình",
    timeLimit: 5, // phút
  };
  const subjectId = location.state.subjectId;
  const options = location.state?.options || {
    shuffleQuestions: true, // Trộn câu hỏi
    showAnswers: true, // Hiển thị đáp án ngay
    shuffleOptions: false, // Trộn đáp án
    rotationalPractice: true, // Cho phép luyện lại câu sai
    timeLimit: true, // Giới hạn thời gian
    scoreMode: false, // Có lưu điểm không
  };

  // State chính
  const [questions, setQuestions] = useState([]); // Danh sách câu hỏi
  const [answers, setAnswers] = useState({}); // Lưu đáp án user
  const [currentIndex, setCurrentIndex] = useState(0); // Câu hiện tại
  const [flagged, setFlagged] = useState([]); // Câu đánh dấu
  const [submitted, setSubmitted] = useState(false); // Bài đã nộp chưa
  const [remainingTime, setRemainingTime] = useState(
    options.timeLimit ? quizInfo.timeLimit * 60 : null // thời gian còn lại tính bằng giây
  );
  const [startTime, setStartTime] = useState(Date.now()); // Thời gian bắt đầu quiz

  // Fetch câu hỏi khi load trang
  useEffect(() => {
    if (!quizId) return;
    const fetchQuestions = async () => {
      try {
        const res = await quizService.getById(quizId); // Lấy quiz từ server
        let fetched = res.data.questions || [];
        if (options.shuffleQuestions)
          fetched = fetched.sort(() => Math.random() - 0.5); // Trộn câu hỏi
        if (options.shuffleOptions)
          fetched = fetched.map((q) => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5), // Trộn đáp án
          }));
        setQuestions(fetched);
        setStartTime(Date.now()); // Lưu thời gian bắt đầu
      } catch {
        console.log("Không lấy được dữ liệu");
      }
    };
    fetchQuestions();
  }, [quizId]);

  // Countdown nếu có giới hạn thời gian
  useEffect(() => {
    if (!options.timeLimit || submitted) return;
    if (remainingTime <= 0) {
      handleSubmit(); // Auto submit khi hết giờ
      alert("⏰ Hết giờ làm bài!");
      return;
    }
    const timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000); // Giảm 1 giây
    return () => clearInterval(timer);
  }, [submitted, remainingTime]);

  // Chọn đáp án
  const handleAnswerSelect = (questionId, option) => {
    if (submitted || (options.showAnswers && answers[questionId])) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // Đánh dấu / bỏ đánh dấu câu hỏi
  const handleToggleFlag = (questionId) => {
    setFlagged((prev) =>
      prev.includes(questionId)
        ? prev.filter((f) => f !== questionId)
        : [...prev, questionId]
    );
  };

  // Submit bài
  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q._id] === q.answer) correct++;
    });
    setSubmitted(true);
    const score = Math.round((correct / questions.length) * 100);
    const totalQuestions = questions.length;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // tính giây

    if (options.scoreMode) {
      try {
        const formattedAnswers = questions
          .filter((q) => answers[q._id])
          .map((q) => ({
            questionId: q._id,
            selectedOption: answers[q._id],
            isCorrect: answers[q._id] === q.answer,
          }));

        await submissionService.createOrUpdate({
          userId,
          quizId,
          answers: formattedAnswers,
          score,
          totalQuestions,
          timeSpent: timeTaken,
        });

        alert(
          `🎯 Bạn đạt ${score}% (${correct}/${totalQuestions} câu đúng)\n⏱️ Thời gian: ${Math.floor(
            timeTaken / 60
          )} phút ${timeTaken % 60} giây`
        );
        navigate(`/quizzes/review/${quizId}`, {
          state: { mode: "latest", subjectId },
        });
      } catch (err) {
        console.error(err);
        alert("❌ Lỗi khi nộp bài. Vui lòng thử lại sau!");
      }
    } else {
      alert(`🎉 Bạn làm đúng ${correct}/${questions.length} câu!`);
    }
  };

  // Luyện lại câu sai (rotational practice)
  const handleRetry = () => {
    const incorrect = questions.filter((q) => answers[q._id] !== q.answer);
    if (incorrect.length === 0) {
      alert("🎉 Bạn đã làm đúng tất cả câu hỏi!");
      navigate(-1); // quay lại trang trước
    }
    setQuestions(incorrect);
    setSubmitted(false);
    setAnswers({});
    setFlagged([]);
    setCurrentIndex(0);
    setRemainingTime(options.timeLimit ? quizInfo.timeLimit * 60 : null);
    setStartTime(Date.now());
  };

  // Nếu câu hỏi chưa load
  if (questions.length === 0)
    return (
      <div className="text-center mt-10 text-gray-600">Đang tải câu hỏi...</div>
    );

  const q = questions[currentIndex]; // Câu hiện tại
  const answeredQuestions = Object.keys(answers)
    .filter((key) => answers[key])
    .map((key) => questions.findIndex((qq) => qq._id === key) + 1); // Số thứ tự câu đã trả lời

  // Format thời gian từ giây sang MM:SS
  const formatTime = (secs) => {
    if (!secs && secs !== 0) return "--:--";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Container
      fluid
      className="h-screen flex flex-col overflow-hidden bg-gray-50"
    >
      {/* --- MAIN QUESTION AREA --- */}
      <div
        className="flex flex-col justify-start w-full max-w-3xl mx-auto mt-[8vh] overflow-y-auto pb-[40vh] scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* --- NAV CONTROLS --- */}
        <div className="flex justify-between items-center mb-5 px-2 w-full">
          <Button
            variant="success"
            disabled={currentIndex === 0} // disable nếu câu đầu
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-400"
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          >
            <FaChevronLeft /> Câu trước
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="success"
              disabled={currentIndex === questions.length - 1} // disable nếu câu cuối
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-400"
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, questions.length - 1)
                )
              }
            >
              Câu sau <FaChevronRight />
            </Button>
            <button
              className={`text-3xl transition-transform focus:outline-none focus:ring-0 active:scale-105 ${
                flagged.includes(q._id)
                  ? "text-yellow-400 scale-110"
                  : "text-gray-400"
              }`}
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                background: "transparent",
              }}
              onClick={() => handleToggleFlag(q._id)}
            >
              🚩
            </button>
          </div>
        </div>

        {/* --- QUESTION HEADER --- */}
        <div className="text-center mb-4">
          <p className="text-2xl font-bold text-gray-800">
            {currentIndex + 1}. {q.question}
          </p>
        </div>

        {/* Nếu câu có hình */}
        {q.image && (
          <div className="flex justify-center my-3">
            <img
              src={
                q.image.startsWith("http")
                  ? q.image
                  : `http://localhost:5000/${q.image}`
              }
              alt="Question"
              className="max-w-full max-h-[400px] rounded-xl shadow-md object-contain"
            />
          </div>
        )}

        {/* --- OPTIONS --- */}
        <div className="flex flex-col gap-4 mt-6">
          {q.options.map((opt, i) => {
            const isSelected = answers[q._id] === opt;
            const hasAnswered = Boolean(answers[q._id]);
            let base =
              "flex items-center gap-3 p-4 rounded-xl cursor-pointer transition";
            let style = "bg-gray-100 hover:bg-gray-300";

            // Highlight đáp án đúng/sai nếu showAnswers
            if (options.showAnswers && hasAnswered) {
              if (opt === q.answer)
                style = "bg-green-100 border border-green-600";
              else if (isSelected && opt !== q.answer)
                style = "bg-red-100 border border-red-600";
            } else if (isSelected) style = "bg-gray-300";

            return (
              <label
                key={i}
                className={`${base} ${style}`}
                onClick={() => handleAnswerSelect(q._id, opt)}
              >
                <input
                  type="radio"
                  name={q._id}
                  checked={isSelected}
                  onChange={() => handleAnswerSelect(q._id, opt)}
                  className="w-5 h-5 accent-green-700"
                />
                <span className="text-lg text-gray-800">{opt}</span>
              </label>
            );
          })}
        </div>

        {/* --- Show đáp án nếu đã submit hoặc showAnswers */}
        {(submitted || (options.showAnswers && answers[q._id])) && (
          <div className="mt-8 p-4 bg-gray-100 rounded-xl">
            <p className="text-green-700 font-semibold">
              ✅ <strong>Đáp án đúng:</strong> {q.answer}
            </p>
            <p className="text-gray-600 mt-2">{q.explain}</p>
          </div>
        )}
      </div>

      {/* --- DRAWER BÊN DƯỚI--- */}
      <QuestionDrawer
        totalQuestions={questions.length}
        answered={answeredQuestions}
        flagged={flagged.map(
          (id) => questions.findIndex((q) => q._id === id) + 1
        )}
        currentQuestion={currentIndex + 1}
        remainingTime={
          options.timeLimit ? formatTime(remainingTime) : "Không giới hạn"
        }
        rotationalPractice={options.rotationalPractice}
        onSelectQuestion={(num) => setCurrentIndex(num - 1)}
        onSubmit={handleSubmit}
        onRetry={handleRetry}
        showRetryButton={options.rotationalPractice}
      />
    </Container>
  );
}
