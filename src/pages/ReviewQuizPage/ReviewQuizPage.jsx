import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ReviewQuizPage.module.css";
import ReviewDrawer from "../../components/ReviewDrawer/ReviewDrawer";
import { useSelector } from "react-redux";
const ReviewQuizPage = () => {
    //Lấy dữ liệu từ Redux
    const isAuthenticated = useSelector(data => data.user.isAuthenticated);
    const account = useSelector((data) => data.user.account);

    console.log(account, 'is Authenticated ' , isAuthenticated);

  const { quizid } = useParams();
  const location = useLocation();
  const initialMode = location.state?.mode || "latest"; // nhận từ QuizListPage
  const [mode, setMode] = useState(initialMode);

  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchQuizAndSubmission = async () => {
      try {
        const userId = localStorage.getItem("userId") || "demoUser"; // tạm gán user giả

        // 1️⃣ Lấy thông tin quiz
        const quizRes = await axios.get(
          `http://localhost:5000/api/quizzes/${quizid}`
        );
        setQuizInfo(quizRes.data);
        setQuestions(quizRes.data.questions || []);

        // 2️⃣ Lấy submission gần nhất
        // const subRes = await axios.get(
        //   `http://localhost:5000/api/submissions/latest/${quizid}/${userId}`
        // );

        // if (!subRes.data) {
        //   alert("Cậu chưa từng làm bài thì sao có lần gần nhất ^^");
        //   setMode("full");
        // } else {
        //   setSubmission(subRes.data);
        // }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndSubmission();
  }, [quizid]);


  if (loading) return <div>Đang tải dữ liệu bài kiểm tra...</div>;
  if (!quizInfo) return <div>Không tìm thấy bài kiểm tra.</div>;

  // 🧠 Dữ liệu answers được lưu trong submission.answers (mảng)
  const userAnswers =
    submission?.answers?.reduce((acc, ans) => {
      acc[ans.questionId] = ans.selectedOption;
      return acc;
    }, {}) || {};

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.quizTitle}>Xem lại: {quizInfo.name}</h2>

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

      {/* Duyệt qua câu hỏi */}
      {questions.map((q, idx) => {
        const userChoice = userAnswers[q._id];
        const isCorrect = userChoice === q.answer;

        // Nếu ở chế độ "full" thì không tô màu gì
        const userOptionClass = (opt) => {
          // Nếu có submission thì tô như cũ
          if (mode === "latest") {
            if (opt === q.answer) return styles.correctOption;
            if (opt === userChoice && opt !== q.answer)
              return styles.incorrectOption;
            return "";
          }

          // Nếu là "full" (xem toàn bộ câu hỏi) thì chỉ highlight đáp án đúng
          if (mode === "full") {
            if (opt === q.answer) return styles.correctOption;
          }

          return "";
        };

        return (
          <div
            key={q._id}
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
                  className={`${styles.optionItem} ${userOptionClass(opt)} ${
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
