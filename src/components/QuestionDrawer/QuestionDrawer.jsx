import { useState } from "react"; // React hook quản lý state
import { ChevronUp, ChevronDown, Flag } from "lucide-react"; // Icon dùng trong drawer
import { useNavigate } from "react-router-dom"; // Điều hướng trang

export default function QuestionDrawer({
  totalQuestions = 50, // Tổng số câu hỏi
  answered = [], // Array các câu đã trả lời
  flagged = [], // Array các câu được đánh dấu
  currentQuestion = 1, // Câu hỏi hiện tại
  onSelectQuestion, // chọn câu
  onSubmit, //  nộp bài
  onRetry, // làm lại câu sai
  remainingTime = "1:30:00", // Thời gian còn lại hiển thị
  showRetryButton = false, // Có hiển thị nút retry không
  rotationalPractice, // Nếu đang luyện tập xoay vòng
}) {
  const [open, setOpen] = useState(true); // State drawer mở hay đóng
  const navigate = useNavigate(); //điều hướng

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
        open
          ? "translate-y-0 h-[28vh]" // Drawer mở
          : "translate-y-[calc(100%-38px)] h-[38px]" // Drawer đóng
      } max-[600px]:${
        open ? "h-[35vh]" : "translate-y-[calc(100%-34px)] h-[34px]"
      }`}
    >
      {/* Nút toggle drawer */}
      <button
        onClick={() => setOpen((prev) => !prev)} // Bật/tắt drawer
        className="absolute top-[-38px] right-5 bg-gray-300 hover:bg-gray-400 transition-colors rounded-t-lg p-2.5 shadow-md max-[600px]:right-3"
      >
        {open ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
      </button>

      {/* Nội dung drawer */}
      <div className="flex justify-between items-start h-full p-5 lg:p-8 max-[600px]:flex-col max-[600px]:items-center max-[600px]:p-4">
        {/* Panel trái – danh sách câu hỏi */}
        <div className="flex-1 overflow-y-auto pr-5 max-[600px]:w-full max-[600px]:pr-0 max-[600px]:mb-4">
          <div className="grid grid-cols-10 gap-3 justify-items-center w-full max-w-2xl mx-auto max-[800px]:grid-cols-8 max-[600px]:grid-cols-7 max-[400px]:grid-cols-6 max-[600px]:gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const num = i + 1;
              const isAnswered = answered.includes(num); // Kiểm tra câu đã trả lời
              const isFlagged = flagged.includes(num); // Kiểm tra câu đã đánh dấu
              const isCurrent = currentQuestion === num; // Câu hiện tại

              return (
                <div key={num} className="relative">
                  {/* Flag hiển thị nếu câu được đánh dấu */}
                  {isFlagged && (
                    <Flag
                      size={12}
                      className="absolute top-[-7px] right-[-7px] text-yellow-700"
                    />
                  )}
                  <button
                    onClick={() => onSelectQuestion(num)} // Chọn câu
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
                    {num} {/* Hiển thị số câu */}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel phải – Thời gian và các nút */}
        <div className="flex flex-col items-center gap-4 min-w-[220px] max-[600px]:w-full max-[600px]:flex-row max-[600px]:justify-around max-[600px]:gap-2">
          {/* Thời gian */}
          <div className="text-center flex-1">
            <p className="text-2xl font-medium text-gray-700 max-[600px]:text-base">
              Thời gian
            </p>
            <p className="text-[#3D763A] text-4xl font-bold max-[600px]:text-2xl">
              {remainingTime}
            </p>
          </div>

          {/* Nút Nộp bài / Dừng ôn tập */}
          {!rotationalPractice ? ( //Nếu không ôn tập xoay vòng
            <button
              onClick={onSubmit} // Nộp bài
              className="w-full text-lg font-semibold text-white bg-[#3D763A] hover:bg-[#2F5D2E] transition-all rounded-xl py-2.5 max-[600px]:text-sm max-[600px]:py-2"
            >
              Nộp bài
            </button>
          ) : ( //Nếu ôn tập xoay vòng
            <button
              onClick={() => navigate(-1)} // Dừng ôn tập quay lại
              className="w-full text-lg font-semibold text-white bg-[#3D763A] hover:bg-[#2F5D2E] transition-all rounded-xl py-2.5 max-[600px]:text-sm max-[600px]:py-2"
            >
              Dừng ôn tập
            </button>
          )}

          {/* Nút làm lại câu sai nếu có */}
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
