import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ReviewDrawer.module.css";

//Drawer giống cái cũ nhưng không tính thời gian và theo chiều ngang
export default function ReviewDrawer({ totalQuestions = 0 }) {
  const [open, setOpen] = useState(false);

  const handleScrollToQuestion = (num) => {
    const el = document.getElementById(`question-${num}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`${styles.drawerContainer} ${open ? styles.open : ""}`}>
      {/* Nút toggle */}
      <button
        className={styles.toggleButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Nội dung drawer */}
      <div className={styles.drawerContent}>
        <h4 className={styles.drawerTitle}>Câu hỏi</h4>
        <div className={styles.gridContainer}>
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <button
              key={i}
              className={styles.questionButton}
              onClick={() => handleScrollToQuestion(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
