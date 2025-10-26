import { useState } from "react";
import { ChevronUp, ChevronDown, Flag } from "lucide-react";
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
  rotationalPractice,
}) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
        open
          ? "translate-y-0 h-[28vh]"
          : "translate-y-[calc(100%-38px)] h-[38px]"
      } max-[600px]:${
        open ? "h-[35vh]" : "translate-y-[calc(100%-34px)] h-[34px]"
      }`}
    >
      {/* Nút toggle */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="absolute top-[-38px] right-5 bg-gray-300 hover:bg-gray-400 transition-colors rounded-t-lg p-2.5 shadow-md max-[600px]:right-3"
      >
        {open ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
      </button>

      <div className="flex justify-between items-start h-full p-5 lg:p-8 max-[600px]:flex-col max-[600px]:items-center max-[600px]:p-4">
        {/* Panel trái – Câu hỏi */}
        <div className="flex-1 overflow-y-auto pr-5 max-[600px]:w-full max-[600px]:pr-0 max-[600px]:mb-4">
          <div className="grid grid-cols-10 gap-3 justify-items-center w-full max-w-2xl mx-auto max-[800px]:grid-cols-8 max-[600px]:grid-cols-7 max-[400px]:grid-cols-6 max-[600px]:gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const num = i + 1;
              const isAnswered = answered.includes(num);
              const isFlagged = flagged.includes(num);
              const isCurrent = currentQuestion === num;

              return (
                <div key={num} className="relative">
                  {isFlagged && (
                    <Flag
                      size={12}
                      className="absolute top-[-7px] right-[-7px] text-yellow-700"
                    />
                  )}
                  <button
                    onClick={() => onSelectQuestion(num)}
                    className={`w-9 h-9 text-sm font-medium flex items-center justify-center rounded-md border-[1.5px] transition-all
                      max-[600px]:w-8 max-[600px]:h-8
                      ${
                        isFlagged
                          ? "bg-yellow-100 border-yellow-400"
                          : isAnswered
                          ? "bg-gray-300 border-gray-400"
                          : "bg-white border-gray-400"
                      }
                      ${
                        isCurrent
                          ? "outline outline-2 outline-[#3D763A] border-[#3D763A] text-[#3D763A]"
                          : "hover:bg-green-50"
                      }`}
                  >
                    {num}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel phải – Thời gian và nút bấm */}
        <div className="flex flex-col items-center gap-4 min-w-[220px] max-[600px]:w-full max-[600px]:flex-row max-[600px]:justify-around max-[600px]:gap-2">
          <div className="text-center flex-1">
            <p className="text-2xl font-medium text-gray-700 max-[600px]:text-base">
              Thời gian
            </p>
            <p className="text-[#3D763A] text-4xl font-bold max-[600px]:text-2xl">
              {remainingTime}
            </p>
          </div>

          {!rotationalPractice ? (
            <button
              onClick={onSubmit}
              className="w-full text-lg font-semibold text-white bg-[#3D763A] hover:bg-[#2F5D2E] transition-all rounded-xl py-2.5 max-[600px]:text-sm max-[600px]:py-2"
            >
              Nộp bài
            </button>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="w-full text-lg font-semibold text-white bg-[#3D763A] hover:bg-[#2F5D2E] transition-all rounded-xl py-2.5 max-[600px]:text-sm max-[600px]:py-2"
            >
              Dừng ôn tập
            </button>
          )}

          {showRetryButton && (
            <button
              onClick={onRetry}
              className="w-full text-lg font-semibold text-[#3D763A] border-2 border-[#3D763A] bg-white hover:bg-green-50 hover:scale-[1.03] transition-all rounded-xl py-2.5 max-[600px]:text-sm max-[600px]:py-2"
            >
              Làm lại câu sai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
