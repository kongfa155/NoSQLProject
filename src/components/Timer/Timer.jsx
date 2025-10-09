import { useState, useEffect } from "react";
import styles from "./Timer.module.css";

export default function Timer({ minutes = 0, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isWarning = timeLeft <= 30;

  return (
    <div
      className={`${styles.timerBox} ${isWarning ? styles.timerWarning : ""}`}
    >
      ⏱ {formatTime(timeLeft)}
    </div>
  );
}
