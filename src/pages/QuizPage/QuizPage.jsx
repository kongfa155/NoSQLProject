import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./QuizPage.module.css";
import QuestionDrawer from "../../components/QuestionDrawer/QuestionDrawer";

export default function QuizPage() {
  const { quizid } = useParams();
  const location = useLocation();

  const quizInfo = location.state?.quiz || {
    name: "Kiểm tra nhanh Giới thiệu ngôn ngữ lập trình",
    timeLimit: 5, // phút
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
  const [startTime, setStartTime] = useState(Date.now()); // ⏰ Bắt đầu tính giờ khi vào trang

  // 🔹 Giả lập câu hỏi
  useEffect(() => {
    let fakeQuestions = [
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
        explain: "JavaScript sẽ chuyển số 3 thành chuỗi → '3' + '2' = '32'.",
      },
      {
        _id: "q4",
        question: "Câu lệnh nào dùng để in ra màn hình trong Python?",
        options: ["echo()", "console.log()", "printf()", "print()"],
        answer: "print()",
        explain: "Hàm print() được dùng để in ra màn hình trong Python.",
      },
    ];

    if (options.shuffleQuestions) {
      fakeQuestions = fakeQuestions.sort(() => Math.random() - 0.5);
    }

    if (options.shuffleOptions) {
      fakeQuestions = fakeQuestions.map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      }));
    }

    setQuestions(fakeQuestions);
    setStartTime(Date.now()); // 🕓 Bắt đầu tính khi câu hỏi load
  }, [quizid]);

  // 🕒 Đếm ngược
  useEffect(() => {
    if (!options.timeLimit || submitted) return;
    if (remainingTime <= 0) {
      handleSubmit();
      alert("⏰ Hết giờ làm bài!");
      return;
    }
    const timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, remainingTime, options.timeLimit]);

  const handleAnswerSelect = (questionId, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleToggleFlag = (questionId) => {
    setFlagged((prev) =>
      prev.includes(questionId)
        ? prev.filter((f) => f !== questionId)
        : [...prev, questionId]
    );
  };

  // 📤 Nộp bài
  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q._id] === q.answer) correct++;
    });

    setSubmitted(true);
    const score = Math.round((correct / questions.length) * 100);
    const totalQuestions = questions.length;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // ⏱️ tính bằng giây

    if (options.scoreMode) {
      try {
        const userId = "670f4e7b1234567890abcd12";
        const res = await fetch("http://localhost:5000/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            quizId: quizid,
            answers,
            score,
            totalQuestions,
            timeTaken,
          }),
        });

        if (!res.ok) throw new Error("Lỗi khi gửi submission lên server");
        const data = await res.json();
        console.log("✅ Nộp bài thành công:", data);
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
    if (!options.rotationalPractice) {
      setSubmitted(false);
      setFlagged([]);
      setAnswers({});
      setCurrentIndex(0);
      setRemainingTime(options.timeLimit ? quizInfo.timeLimit * 60 : null);
      setStartTime(Date.now());
      return;
    }

    const incorrect = questions.filter((q) => answers[q._id] !== q.answer);
    if (incorrect.length === 0) {
      alert("🎉 Bạn đã làm đúng tất cả câu hỏi!");
      return;
    }

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
        <div className={styles.questionHeader}>
          <p className={styles.questionText}>
            {currentIndex + 1}. {q.question}
          </p>
          <button
            className={`${styles.flagButton} ${
              flagged.includes(q._id) ? styles.flaggedButton : ""
            }`}
            onClick={() => handleToggleFlag(q._id)}
          >
            🚩
          </button>
        </div>

        {/* --- DANH SÁCH ĐÁP ÁN --- */}
        <div className={styles.optionList}>
          {q.options.map((opt, i) => {
            const isSelected = answers[q._id] === opt;
            const hasAnswered = Boolean(answers[q._id]);
            let optionClass = styles.optionRow;

            if (options.showAnswers && hasAnswered) {
              if (opt === q.answer) optionClass += ` ${styles.correctOption}`;
              else if (isSelected && opt !== q.answer)
                optionClass += ` ${styles.incorrectOption}`;
            } else if (isSelected) {
              optionClass += ` ${styles.optionSelected}`;
            }

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
