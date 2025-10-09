import { useState } from "react";
import { ChevronUp, ChevronDown, Flag } from "lucide-react";
import styles from "./QuestionDrawer.module.css";

export default function QuestionDrawer({
  totalQuestions = 50,
  answered = [],
  flagged = [],
  currentQuestion = 1,
  onSelectQuestion,
  onSubmit,
  onRetry,
  remainingTime = "1:30:00",
  showRetryButton = false, // 👈 nhận prop mới
}) {
  const [open, setOpen] = useState(true);
  const questionCount = 50;

  return (
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
        <div className={styles.leftPanel}>
          <div className={styles.gridContainer}>
            {Array.from({ length: questionCount }).map((_, i) => {
              const num = i + 1;
              if (num > totalQuestions) return null;

              const isAnswered = answered.includes(num);
              const isFlagged = flagged.includes(num);
              const isCurrent = currentQuestion === num;

              let btnClass = styles.questionBox;
              if (isFlagged) btnClass += ` ${styles.flagged}`;
              else if (isAnswered) btnClass += ` ${styles.answered}`;
              if (isCurrent) btnClass += ` ${styles.current}`;

              return (
                <div key={num} className={styles.questionWrapper}>
                  {isFlagged && <Flag size={12} className={styles.flagIcon} />}
                  <button
                    className={btnClass}
                    onClick={() => onSelectQuestion(num)}
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

          <button className={styles.submitButton} onClick={onSubmit}>
            Nộp bài
          </button>

          {/* 👇 Chỉ hiển thị nếu bật “Luyện tập xoay vòng” */}
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
