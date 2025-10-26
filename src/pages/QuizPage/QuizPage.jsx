import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import quizService from "../../services/quizService";
import submissionService from "../../services/submissionService";
import QuestionDrawer from "../../components/QuestionDrawer/QuestionDrawer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button, Container } from "react-bootstrap"; // ✅ React-Bootstrap

export default function QuizPage() {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const account = useSelector((state) => state.user.account);
  const userId = account?.id;

  if (!userId)
    return (
      <div className="text-center text-red-500 mt-10">
        Vui lòng đăng nhập để làm bài.
      </div>
    );

  const quizInfo = location.state?.quiz || {
    name: "Kiểm tra nhanh Giới thiệu ngôn ngữ lập trình",
    timeLimit: 5,
  };
  const subjectId = location.state.subjectId;
  const options = location.state?.options || {
    shuffleQuestions: true,
    showAnswers: true,
    shuffleOptions: false,
    rotationalPractice: true,
    timeLimit: true,
    scoreMode: false,
  };

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flagged, setFlagged] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(
    options.timeLimit ? quizInfo.timeLimit * 60 : null
  );
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    if (!quizId) return;
    const fetchQuestions = async () => {
      try {
        const res = await quizService.getById(quizId);
        let fetched = res.data.questions || [];
        if (options.shuffleQuestions)
          fetched = fetched.sort(() => Math.random() - 0.5);
        if (options.shuffleOptions)
          fetched = fetched.map((q) => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5),
          }));
        setQuestions(fetched);
        setStartTime(Date.now());
      } catch {
        console.log("Không lấy được dữ liệu");
      }
    };
    fetchQuestions();
  }, [quizId]);

  useEffect(() => {
    if (!options.timeLimit || submitted) return;
    if (remainingTime <= 0) {
      handleSubmit();
      alert("⏰ Hết giờ làm bài!");
      return;
    }
    const timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, remainingTime]);

  const handleAnswerSelect = (questionId, option) => {
    if (submitted || (options.showAnswers && answers[questionId])) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleToggleFlag = (questionId) => {
    setFlagged((prev) =>
      prev.includes(questionId)
        ? prev.filter((f) => f !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q._id] === q.answer) correct++;
    });
    setSubmitted(true);
    const score = Math.round((correct / questions.length) * 100);
    const totalQuestions = questions.length;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

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

  const handleRetry = () => {
    const incorrect = questions.filter((q) => answers[q._id] !== q.answer);
    if (incorrect.length === 0) {
      alert("🎉 Bạn đã làm đúng tất cả câu hỏi!");
      navigate(-1);
    }
    setQuestions(incorrect);
    setSubmitted(false);
    setAnswers({});
    setFlagged([]);
    setCurrentIndex(0);
    setRemainingTime(options.timeLimit ? quizInfo.timeLimit * 60 : null);
    setStartTime(Date.now());
  };

  if (questions.length === 0)
    return (
      <div className="text-center mt-10 text-gray-600">Đang tải câu hỏi...</div>
    );

  const q = questions[currentIndex];
  const answeredQuestions = Object.keys(answers)
    .filter((key) => answers[key])
    .map((key) => questions.findIndex((qq) => qq._id === key) + 1);

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
            disabled={currentIndex === 0}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-400"
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          >
            <FaChevronLeft /> Câu trước
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="success"
              disabled={currentIndex === questions.length - 1}
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

        {(submitted || (options.showAnswers && answers[q._id])) && (
          <div className="mt-8 p-4 bg-gray-100 rounded-xl">
            <p className="text-green-700 font-semibold">
              ✅ <strong>Đáp án đúng:</strong> {q.answer}
            </p>
            <p className="text-gray-600 mt-2">{q.explain}</p>
          </div>
        )}
      </div>

      {/* --- DRAWER --- */}
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
