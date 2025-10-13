import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "./QuizPage.module.css";
import QuestionDrawer from "../../components/QuestionDrawer/QuestionDrawer"; //Cái bảng chọn câu hỏi
import axios from "axios";

export default function QuizPage() {
  const { quizid } = useParams(); //Lấy id bài
  const location = useLocation();
  const navigate = useNavigate();
  //Lấy state được truyền để biết tên bài
  const quizInfo = location.state?.quiz || {
    name: "Kiểm tra nhanh Giới thiệu ngôn ngữ lập trình",
    timeLimit: 5, // phút
  };
  //Lấy dữ liệu lựa chọn để thiết lập cách làm bài, nếu không có thì set mặc định
  const options = location.state?.options || {
    shuffleQuestions: true,
    showAnswers: true,
    shuffleOptions: false,
    rotationalPractice: true,
    timeLimit: true,
    scoreMode: false,
  };

  const [questions, setQuestions] = useState([]); //Lưu các câu hỏi
  const [answers, setAnswers] = useState({}); //Lưu đáp án
  const [currentIndex, setCurrentIndex] = useState(0); //Câu hỏi hiện tại
  const [flagged, setFlagged] = useState([]); //Cái cờ
  const [submitted, setSubmitted] = useState(false); //Kiểm tra nộp bài
  const [remainingTime, setRemainingTime] = useState(
    options.timeLimit ? quizInfo.timeLimit * 60 : null
  ); //Bộ đếm thời gian
  const [startTime, setStartTime] = useState(Date.now()); //Bắt đầu tính giờ khi vào trang

  // Fake data
  useEffect(() => {
    if (!quizid) return;
    const fetchQuestions = async () => {
      try {
        const res = await axios(`http://localhost:5000/api/quizzes/${quizid}`);
        const data = res.data;
        console.log(data);

        let fetchQuestions = [];
        if (data.questions) fetchQuestions = data.questions;
        else console.log("Không có data");
        // Nếu có trộn câu hỏi thì hãy xáo trộn thứ tự câu hỏi bằng cách sắp xếp ngẫu nhiên
        // Tà đạo vc, so sánh bên trái với bên phải nhưng trả về là tùy tâm trạng chứ không dựa vào nó lớn hơn hay bé hơn =)))
        if (options.shuffleQuestions) {
          fetchQuestions = fetchQuestions.sort(() => Math.random() - 0.5);
        }
        //Đảo thứ tự đáp án
        if (options.shuffleOptions) {
          fetchQuestions = fetchQuestions.map((q) => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5),
          }));
        }

        setQuestions(fetchQuestions);
        setStartTime(Date.now()); //Bắt đầu tính khi câu hỏi load
      } catch {
        console.log("Can't get data");
      }
    };
    fetchQuestions();
  }, [quizid]); //Chạy khi đổi đề giữa chừng luôn (nếu có)

  // Đếm ngược thời gian
  useEffect(() => {
    if (!options.timeLimit || submitted) return;
    if (remainingTime <= 0) {
      handleSubmit();
      alert("⏰ Hết giờ làm bài!");
      return;
    } //Hết giờ thì thông báo hết giờ và gọi hàm nộp bài
    const timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, remainingTime, options.timeLimit]);

  const handleAnswerSelect = (questionId, option) => {
    if (submitted ||(options.showAnswers && answers[questionId])) return;
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }; //Xử lý chọn đáp án

  const handleToggleFlag = (questionId) => {
    setFlagged((prev) =>
      prev.includes(questionId)
        ? prev.filter((f) => f !== questionId)
        : [...prev, questionId]
    );
  }; //Xử lý bật cờ, nếu câu hỏi được bật cờ, thêm nó vào array, không thì xóa

  // Nộp bài
  const handleSubmit = async () => {
    //Đếm câu đúng
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q._id] === q.answer) correct++;
    });
    //Cập nhật trạng thái nộp
    setSubmitted(true);
    const score = Math.round((correct / questions.length) * 100);
    const totalQuestions = questions.length;
    //Tính thời gian làm bài
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // tính bằng giây
    //Nếu mà đang ở chế độ làm bài tính điểm thì gửi bài lên cho submission
    //Này tạm thời đang xài thằng fetch, sau này phải đổi sang axios
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
        //   navigate(`/quizzes/review/${quizId}`, { state: { mode: "latest" } }); Phải đợi có user mới làm tiếp được
      } catch (err) {
        console.error(err);
        alert("❌ Lỗi khi nộp bài. Vui lòng thử lại sau!");
      }
    } else {
      alert(`🎉 Bạn làm đúng ${correct}/${questions.length} câu!`);
    }
  };
  //Xử lý luyện tập lại
  const handleRetry = () => {
    //Nếu mà số câu làm sai không còn thì không thể làm lại
    const incorrect = questions.filter((q) => answers[q._id] !== q.answer);
    if (incorrect.length === 0) {
      alert("🎉 Bạn đã làm đúng tất cả câu hỏi!");
      return;
    }
    //Reset trạng thái các câu hỏi
    setQuestions(incorrect); //Câu nào sai thì được thêm vào danh sách làm lại
    setSubmitted(false);
    setAnswers({});
    setFlagged([]);
    setCurrentIndex(0);
    setRemainingTime(options.timeLimit ? quizInfo.timeLimit * 60 : null);
    setStartTime(Date.now());
  };

  if (questions.length === 0) return <div>Đang tải câu hỏi...</div>;

  const q = questions[currentIndex];
  //Cập nhật lại số thứ tự
  const answeredQuestions = Object.keys(answers)
    .filter((key) => answers[key])
    .map((key) => questions.findIndex((qq) => qq._id === key) + 1);
  //Set lại thời gian
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
          {/* Nút cờ */}
          <button
            className={`${styles.flagButton} ${
              flagged.includes(q._id) ? styles.flaggedButton : ""
            }`}
            onClick={() => handleToggleFlag(q._id)}
          >
            🚩
          </button>
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
        {/* Danh sách đáp án */}
        <div className={styles.optionList}>
          {q.options.map((opt, i) => {
            const isSelected = answers[q._id] === opt;
            const hasAnswered = Boolean(answers[q._id]);
            let optionClass = styles.optionRow;
            // Nếu trạng thái hiển thị đáp án và có đáp án
            if (options.showAnswers && hasAnswered) {
              // đáp án đúng tô màu đáp án đúng
              if (opt === q.answer) optionClass += ` ${styles.correctOption}`;
              else if (isSelected && opt !== q.answer)
                //đáp án sai tô màu sai và tô màu đáp án đúng
                optionClass += ` ${styles.incorrectOption}`;
            } else if (isSelected) {
              //Nếu không bật thì chỉ tô màu đáp án được chọn
              optionClass += ` ${styles.optionSelected}`;
            }

            return (
              <label
                key={i}
                className={optionClass}
                onClick={() => handleAnswerSelect(q._id, opt)}
              >
                {/* Radio cho phép chọn 1 trong các đáp án */}
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
        {/* Chú thích chỉ bật khi có showw đáp án và đã chọn đáp án thôi hoặc đã nộp bài */}
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
        answered={answeredQuestions} //Truyền để cập nhật màu
        flagged={flagged.map(
          (id) => questions.findIndex((q) => q._id === id) + 1
        )} //Truyền các câu có flag để cập nhật màu
        currentQuestion={currentIndex + 1} //Truyền để xử lý hiển thị
        remainingTime={
          options.timeLimit ? formatTime(remainingTime) : "Không giới hạn"
        } //Set thời gian
        onSelectQuestion={(num) => setCurrentIndex(num - 1)} //Xử lý chọn câu hỏi
        onSubmit={handleSubmit} // XỬ lý nút nộp
        onRetry={handleRetry} //Xử lý nút retry
        showRetryButton={options.rotationalPractice} //Hiển thị nút làm lại hay không
      />
    </div>
  );
}
