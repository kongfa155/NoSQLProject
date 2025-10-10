import { useState, useEffect } from "react";
import styles from "./Timer.module.css";

export default function Timer({ minutes = 0, onTimeUp }) { //Minutes là thời gian ban đầu, onTimeUp là hàm xử lý khi hết giờ
  const [timeLeft, setTimeLeft] = useState(minutes * 60); //Đổi thời gian về giây

  useEffect(() => {
    //Hết giờ gọi hàm onTimeUp
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }
    //Thằng này cập nhật lại Time nè
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]); //Render lại thằng này mỗi khi thời gian thay đổi

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }; //Chuyển định dạng hiển thị

  const isWarning = timeLeft <= 30; //Sắp hết thời gian thì set này để cảnh báo

  return (
    <div
      className={`${styles.timerBox} ${isWarning ? styles.timerWarning : ""}`}
    >
      ⏱ {formatTime(timeLeft)}
    </div>
  );
}
