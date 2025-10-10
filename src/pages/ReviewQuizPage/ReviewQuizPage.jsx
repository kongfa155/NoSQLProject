import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./ReviewQuizPage.module.css";
import ReviewDrawer from "../../components/ReviewDrawer/ReviewDrawer";

const ReviewQuizPage = () => {
  const { quizid } = useParams();
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
    const location = useLocation();
    const submission = location.state?.data;
    useEffect(() => {
    const fetchQuiz = async () => {
        if(submission) {
            //Sau này fetch dữ liệu câu hỏi
        } 
      const fakeQuiz = {
        _id: quizid,
        name: "Kiểm tra nhanh Giới thiệu ngôn ngữ lập trình",
        timeLimit: 5,
        questions: [
          {
            _id: "q1",
            question: "Ngôn ngữ lập trình nào sau đây là ngôn ngữ bậc thấp?",
            options: ["Python", "C", "Assembly", "Java"],
            answer: "Assembly",
            explain: "Assembly là ngôn ngữ bậc thấp gần với mã máy nhất.",
          },
          {
            _id: "q2",
            question: "Từ khóa nào dùng để khai báo biến trong JavaScript?",
            options: ["var", "int", "define", "dim"],
            answer: "var",
            explain: "JavaScript dùng var, let, const để khai báo biến.",
          },
          {
            _id: "q3",
            question: "Kết quả của 3 + '2' trong JavaScript là gì?",
            options: ["5", "32", "NaN", "Error"],
            answer: "32",
            explain:
              "JavaScript sẽ chuyển số 3 thành chuỗi → '3' + '2' = '32'.",
          },
        ],
      };

      setQuizInfo(fakeQuiz);
      setQuestions(fakeQuiz.questions);
      setLoading(false);
    
    };

    fetchQuiz();
  }, [quizid]);

  if (loading) return <div>Đang tải dữ liệu bài kiểm tra...</div>;

  return (
    // Hiển thị tiêu đề
    <div className={styles.reviewContainer}>
      <h2 className={styles.quizTitle}>Xem lại: {quizInfo.name}</h2>
      <p className={styles.quizInfo}>
        Thời gian giới hạn: {quizInfo.timeLimit} phút
      </p>
    {/* Hiển thị toàn bộ câu hỏi và giải thích */}
      {questions.map((q, idx) => (
        <div
          key={q._id}
          id={`question-${idx + 1}`}
          className={styles.questionBlock}
        >
          <p className={styles.questionText}>
            {idx + 1}. {q.question}
          </p>
            {/* Hiển thị toàn bộ đáp án và set class đáp án */}
          <ul className={styles.optionList}>
            {q.options.map((opt, i) => (
              <li
                key={i}
                className={`${styles.optionItem}
                 ${opt === submission?.answer[q._id] ? styles.userChoice : ""}
                 ${opt === q.answer ? styles.correctOption : ""}
                 `}
              >
                {opt}
              </li>
            ))}
          </ul>
            {/* Chỗ này hiển thị giải thích */}
          <div className={styles.explainBox}>
            <span className={styles.explainLabel}>💡 Giải thích:</span>
            <p className={styles.explainText}>{q.explain}</p>
          </div>
        </div>
      ))}

      {/* Drawer mới */}
      <ReviewDrawer totalQuestions={questions.length} />
    </div>
  );
};

export default ReviewQuizPage;
