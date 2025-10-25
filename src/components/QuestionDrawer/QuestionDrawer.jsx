import { useState } from "react";
import { ChevronUp, ChevronDown, Flag } from "lucide-react";
import styles from "./QuestionDrawer.module.css";
import { useNavigate } from "react-router-dom";

export default function QuestionDrawer({
  totalQuestions = 50,
  answered = [],
  flagged = [],
  currentQuestion = 1,
  onSelectQuestion,
  onSubmit,
  onRetry,
  remainingTime = "1:30:00",
  showRetryButton = false,
  rotationalPractice
}) {
  const [open, setOpen] = useState(true);
    const navigate = useNavigate();
  return (
    //Cập nhật trạng thái kéo lên hay xuống
    <div
      className={`${styles.drawerContainer} ${
        open ? styles.open : styles.closed
      }`}
    >
      {/* Nút toggle bên phải */}
      <button
        className={styles.toggleButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
      </button>

      <div className={styles.drawerContent}>
        {/* Bên trái chỗ hiển thị cau hỏi */}
        <div className={styles.leftPanel}>
          {/* Thiệp lập dạng lưới để render đẹp hơn */}
          <div className={styles.gridContainer}>
            {/* Gán số cho ô, nếu nhiều hơn thì render ra null */}
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const num = i + 1;
              if (num > totalQuestions) return null;

              const isAnswered = answered.includes(num); //Kiểm tra câu hỏi có nằm trong số câu đã trả lời hay không
              const isFlagged = flagged.includes(num); //Kiểm tra câu hỏi có nằm trong số câu đã gắn cờ
              const isCurrent = currentQuestion === num; //Kiểm tra câu hỏi có phải câu hiện tại không

              let btnClass = styles.questionBox; //Css theo thuộc tính ở trên
              if (isFlagged) btnClass += ` ${styles.flagged}`;
              else if (isAnswered) btnClass += ` ${styles.answered}`;
              if (isCurrent) btnClass += ` ${styles.current}`;

              return (
                <div key={num} className={styles.questionWrapper}>
                  {isFlagged && <Flag size={12} className={styles.flagIcon} />}
                  <button
                    className={btnClass}
                    onClick={() => onSelectQuestion(num)} 
                    // Chọn số thì sẽ gọi hàm chỉnh câu hỏi hiện tại, xong render lại trang
                  >
                    {num}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.timerBox}>
            <p className={styles.timerLabel}>Thời gian</p>
            <p className={styles.timerValue}>{remainingTime}</p>
          </div>
            {!rotationalPractice ? (
          <button className={styles.submitButton} onClick={onSubmit}>
            Nộp bài
          </button>
            ) : <button className={styles.submitButton} onClick={()=> navigate(-1)}>Dừng ôn tập</button>}
          {/* Hiển thị cái nút này nếu bật làm bài lại nè */}
          {showRetryButton && (
            <button className={styles.retryButton} onClick={onRetry}>
              Làm lại câu sai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


