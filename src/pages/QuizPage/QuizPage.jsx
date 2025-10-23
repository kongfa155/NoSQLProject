import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./QuizPage.module.css";
import QuestionDrawer from "../../components/QuestionDrawer/QuestionDrawer";
import { useSelector } from "react-redux";
import quizService from "../../services/quizService";
import submissionService from "../../services/submissionService";
// ✨ IMPORT ICONS MỚI
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function QuizPage() {
  const { quizId } = useParams();
  const location = useLocation();

  const account = useSelector((state) => state.user.account);
  const userId = account?.id;

  if (!userId) return <div>Vui lòng đăng nhập để làm bài.</div>;

  const quizInfo = location.state?.quiz || {
    name: "Kiểm tra nhanh Giới thiệu ngôn ngữ lập trình",
    timeLimit: 5,
  };
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
        let fetchQuestions = res.data.questions || [];

        if (options.shuffleQuestions)
          fetchQuestions = fetchQuestions.sort(() => Math.random() - 0.5);
        if (options.shuffleOptions)
          fetchQuestions = fetchQuestions.map((q) => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5),
          }));

        setQuestions(fetchQuestions);
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

        const res = await submissionService.createOrUpdate({
          userId,
          quizId,
          answers: formattedAnswers,
          score,
          totalQuestions,
          timeSpent: timeTaken,
        });

        console.log("✅ Nộp bài thành công:", res.data);
        alert(
          `🎯 Bạn đạt ${score}% (${correct}/${totalQuestions} câu đúng)\n⏱️ Thời gian: ${Math.floor(
            timeTaken / 60
          )} phút ${timeTaken % 60} giây`
        );
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
    if (incorrect.length === 0)
      return alert("🎉 Bạn đã làm đúng tất cả câu hỏi!");
    setQuestions(incorrect);
    setSubmitted(false);
    setAnswers({});
    setFlagged([]);
    setCurrentIndex(0);
    setRemainingTime(options.timeLimit ? quizInfo.timeLimit * 60 : null);
    setStartTime(Date.now());
  };

  if (questions.length === 0) return <div>Đang tải câu hỏi...</div>;

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
    <div className={styles.quizContainer}>
      {/* --- CÂU HỎI HIỆN TẠI --- */}
      <div className={styles.fullQuestionArea}>
        {/* ✨ KHỐI ĐIỀU KHIỂN NAVIGATOR MỚI (Nằm trên câu hỏi) */}
        <div className={styles.navControls}>
          {/* Nút CÂU TRƯỚC */}
          <button
            className={styles.navBtn}
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          >
            <FaChevronLeft size={16} style={{ marginRight: "6px" }} /> Câu trước
          </button>

          {/* Phần chứa nút CẮM CỜ và CÂU SAU */}
          <div className={styles.rightHeader}>
            <button
              className={styles.navBtn}
              disabled={currentIndex === questions.length - 1}
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, questions.length - 1)
                )
              }
            >
              Câu sau <FaChevronRight size={16} style={{ marginLeft: "6px" }} />
            </button>
            <button
              className={`${styles.flagButton} ${
                flagged.includes(q._id) ? styles.flaggedButton : ""
              }`}
              onClick={() => handleToggleFlag(q._id)}
            >
              🚩
            </button>
          </div>
        </div>

        {/* ✨ HEADER CHỈ CÒN TEXT CÂU HỎI */}
        <div className={styles.questionHeader}>
          <p className={styles.questionText}>
            {currentIndex + 1}. {q.question}
          </p>
        </div>

        {q.image && (
          <div className={styles.questionIMGContainer}>
            <img
              src={
                q.image.startsWith("http")
                  ? q.image
                  : `http://localhost:5000/${q.image}`
              }
              alt="Question"
              className={styles.QuestionIMG}
            />
          </div>
        )}
        <div className={styles.optionList}>
          {q.options.map((opt, i) => {
            const isSelected = answers[q._id] === opt;
            const hasAnswered = Boolean(answers[q._id]);
            let optionClass = styles.optionRow;
            if (options.showAnswers && hasAnswered) {
              if (opt === q.answer) optionClass += ` ${styles.correctOption}`;
              else if (isSelected && opt !== q.answer)
                optionClass += ` ${styles.incorrectOption}`;
            } else if (isSelected) optionClass += ` ${styles.optionSelected}`;

            return (
              <label
                key={i}
                className={optionClass}
                onClick={() => handleAnswerSelect(q._id, opt)}
              >
                <input
                  type="radio"
                  name={q._id}
                  checked={isSelected}
                  onChange={() => handleAnswerSelect(q._id, opt)}
                  className={styles.radioInput}
                />
                <span className={styles.optionText}>{opt}</span>
              </label>
            );
          })}
        </div>
        {(submitted || (options.showAnswers && answers[q._id])) && (
          <div className={styles.explainBox}>
            <p>
              ✅ <strong>Đáp án đúng:</strong> {q.answer}
            </p>
            <p className={styles.explainText}>{q.explain}</p>
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
        onSelectQuestion={(num) => setCurrentIndex(num - 1)}
        onSubmit={handleSubmit}
        onRetry={handleRetry}
        showRetryButton={options.rotationalPractice}
      />
    </div>
  );
}
