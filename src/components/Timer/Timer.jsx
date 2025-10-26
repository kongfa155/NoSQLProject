import { useState, useEffect } from "react";

export default function Timer({ minutes = 0, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const formatTime = (sec) => {
    if (sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isWarning = timeLeft > 0 && timeLeft <= 30;

  return (
    <div
      className={`flex items-center justify-center rounded-lg p-2 sm:px-4 font-semibold text-xl min-w-[100px] transition-all duration-300 border-2 ${
        isWarning
          ? "border-[#dc2626] text-[#dc2626] bg-[#fee2e2] animate-pulse"
          : "border-[#2f834d] text-[#2f834d] bg-[#ecfdf5]"
      }`}
    >
      ⏱ {formatTime(timeLeft)}
    </div>
  );
}
