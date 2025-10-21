import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./ReviewQuizPage.module.css";
import ReviewDrawer from "../../components/ReviewDrawer/ReviewDrawer";
import { useSelector } from "react-redux";
import quizService from "../../services/quizService";
import submissionService from "../../services/submissionService";

const ReviewQuizPage = () => {
  // Redux
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const account = useSelector((state) => state.user.account);
  const userId = account?.id; // Redux lưu id là string

  const { quizId } = useParams();
  const location = useLocation();
  const initialMode = location.state?.mode || "latest";
  const [mode, setMode] = useState(initialMode);

  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch quiz + latest submission
  useEffect(() => {
    if (!userId) return;

    const fetchQuizAndSubmission = async () => {
      setLoading(true);
      try {
        // 1️⃣ Quiz info
        const quizRes = await quizService.getById(quizId);
        setQuizInfo(quizRes.data);
        setQuestions(quizRes.data.questions || []);

        // 2️⃣ Latest submission
        const subRes = await submissionService.getLatest(quizId, userId);

        if (!subRes.data) {
          // User chưa làm bài → mode full
          setSubmission(null);
          setMode("full");
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

  if (!isAuthenticated) return <div>Vui lòng đăng nhập để xem bài làm.</div>;
  if (loading) return <div>Đang tải dữ liệu bài kiểm tra...</div>;
  if (!quizInfo) return <div>Không tìm thấy bài kiểm tra.</div>;

  // ✅ Chuyển mảng answers thành object để lookup nhanh
  const userAnswers =
    submission?.answers?.reduce((acc, ans) => {
      acc[ans.questionId.toString()] = ans.selectedOption;
      return acc;
    }, {}) || {};

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.quizTitle}>Xem lại: {quizInfo.name}</h2>

      {/* Hiển thị điểm nếu xem lần làm gần nhất */}
      {submission && mode === "latest" && (
        <div className={styles.scoreBox}>
          <p>🎯 Điểm lần này: {submission.score}%</p>
          {submission.bestScore !== undefined && (
            <p>🏆 Điểm cao nhất: {submission.bestScore}%</p>
          )}
          <p>
            ⏱️ Thời gian làm bài: {Math.floor(submission.timeSpent / 60)} phút{" "}
            {submission.timeSpent % 60} giây
          </p>
        </div>
      )}

      {/* Duyệt câu hỏi */}
      {questions.map((q, idx) => {
        const questionIdStr = q._id.toString(); // convert ObjectId sang string
        const userChoice = userAnswers[questionIdStr];

        // Hàm xác định class cho option
        const getOptionClass = (opt) => {
          if (mode === "latest") {
            if (opt === q.answer) return styles.correctOption; // đáp án đúng
            if (opt === userChoice && opt !== q.answer)
              return styles.incorrectOption; // user chọn sai
            return "";
          }
          if (mode === "full") {
            if (opt === q.answer) return styles.correctOption;
            return "";
          }
          return "";
        };

        return (
          <div
            key={questionIdStr}
            id={`question-${idx + 1}`}
            className={styles.questionBlock}
          >
            <p className={styles.questionText}>
              {idx + 1}. {q.question}
            </p>

            {q.image && (
              <div className={styles.imageWrapper}>
                <img
                  src={
                    q.image.startsWith("http")
                      ? q.image
                      : `http://localhost:5000/${q.image}`
                  }
                  alt="Question"
                  className={styles.questionImage}
                />
              </div>
            )}

            <ul className={styles.optionList}>
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className={`${styles.optionItem} ${getOptionClass(opt)} ${
                    userChoice === opt && mode === "latest"
                      ? styles.userChoice
                      : ""
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>

            <div className={styles.explainBox}>
              <span className={styles.explainLabel}>💡 Giải thích:</span>
              <p className={styles.explainText}>{q.explain}</p>
            </div>
          </div>
        );
      })}

      <ReviewDrawer totalQuestions={questions.length} />
    </div>
  );
};

export default ReviewQuizPage;
