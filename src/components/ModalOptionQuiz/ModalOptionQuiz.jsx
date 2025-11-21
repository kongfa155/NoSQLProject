import { useState } from "react"; // React hook quản lý state
import { Modal, Button, Form } from "react-bootstrap"; // Modal & Form component
import "bootstrap/dist/css/bootstrap.min.css"; // CSS bootstrap

export default function ModalOptionQuiz({
  show, // có hiển thị modal hay không
  quiz, // thông tin quiz hiện tại
  onClose, //  đóng modal
  onStart, // bắt đầu làm bài
  subjectId, // id môn học liên quan (nếu cần)
}) {
  // State chứa các option trong modal
  const [options, setOptions] = useState({
    shuffleQuestions: true, // Đảo thứ tự câu hỏi
    showAnswers: true, // Hiển thị đáp án
    shuffleOptions: false, // Đảo đáp án
    rotationalPractice: true, // Luyện tập xoay vòng
    timeLimit: false, // Tính thời gian
    scoreMode: false, // Làm bài có tính điểm
  });

  // Nếu chưa có quiz, không render modal
  if (!quiz) return null;

  /**
   * Toggle option
   * key của option cần toggle
   */
  const handleToggle = (key) => {
    if (key === "scoreMode") {
      // Khi bật chế độ tính điểm, reset một số option khác theo yêu cầu
      setOptions((prev) => {
        const next = !prev.scoreMode;
        if (next) {
          return {
            ...prev,
            scoreMode: true,
            shuffleQuestions: true,
            shuffleOptions: true,
            timeLimit: true,
            showAnswers: false,
            rotationalPractice: false,
          };
        } else {
          return { ...prev, scoreMode: false };
        }
      });
      return;
    }

    // Nếu đang bật scoreMode thì chặn thay đổi options khác
    if (options.scoreMode) return;

    // Toggle option thông thường
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /**
   * Format thời gian từ phút sang HH:MM
   * minutes
   */
  const formatTime = (minutes) => {
    if (!minutes) return "00:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  return (
    <Modal
      show={show} // hiển thị modal
      onHide={onClose} // đóng modal
      centered // căn giữa màn hình
      dialogClassName="!max-w-[960px] !w-[960px] md:max-lg:!max-w-[80%] md:max-lg:!w-[80%] sm:max-md:!max-w-[95%] sm:max-md:!w-[95%]"
      contentClassName="!border-2 !border-gray-300 !shadow-[0_0_4px_2px_#31872D] !rounded-none !p-8 flex flex-col !overflow-visible"
    >
      {/* Header: nút đóng */}
      <Modal.Header className="flex justify-end p-2 sm:p-4 border-0">
        <Button
          variant="light"
          onClick={onClose}
          className="hover:bg-gray-100 !rounded-full !p-2 transition-colors duration-200"
        >
          X 
        </Button>
      </Modal.Header>

      {/* Body — tự giãn, không scroll */}
      <Modal.Body className="flex flex-col gap-6 p-8 sm:p-4 overflow-visible">
        {/* --- Phần tiêu đề --- */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-6 md:gap-0">
          <div>
            <span className="text-[24px] text-gray-500 font-medium">
              Bài học
            </span>
            <h3 className="text-[40px] font-bold text-[#2F834D] mt-2 mb-0 break-words">
              {quiz.name} {/* Tên quiz */}
            </h3>
          </div>
          <div className="text-right md:text-left">
            <span className="text-[24px] text-gray-500 font-medium">
              Thời gian làm bài
            </span>
            <div className="text-[32px] font-semibold text-[#53986A] mt-2">
              {formatTime(quiz.timeLimit)} {/* Hiển thị thời gian */}
            </div>
          </div>
        </div>

        <hr className="border-0 h-px bg-gray-300 my-1" />

        {/* --- Tùy chỉnh luyện tập --- */}
        <h4 className="text-[36px] font-semibold text-[#3D763A]">
          Tùy chỉnh luyện tập
        </h4>

        {/* --- Các Option --- */}
        <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
          {[
            { label: "Đảo câu hỏi", key: "shuffleQuestions" },
            { label: "Biết đáp án", key: "showAnswers" },
            { label: "Đảo đáp án", key: "shuffleOptions" },
            { label: "Luyện tập xoay vòng", key: "rotationalPractice" },
            { label: "Tính thời gian", key: "timeLimit" },
            { label: "Làm bài có tính điểm", key: "scoreMode" },
          ].map(({ label, key }) => {
            // Nếu bật scoreMode, các option khác mờ và disabled
            const isScoreMode = options.scoreMode && key !== "scoreMode";
            return (
              <div
                key={key}
                className={`flex justify-between items-center text-[24px] font-medium ${
                  isScoreMode ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <span>{label}</span>
                <Form.Check
                  type="switch"
                  id={key}
                  checked={options[key]}
                  onChange={() => handleToggle(key)}
                  className="[&_.form-check-input]:!w-12 [&_.form-check-input]:!h-[1.6rem]
                             [&_.form-check-input]:!bg-gray-200 [&_.form-check-input]:!border-none 
                             [&_.form-check-input]:!cursor-pointer [&_.form-check-input]:!transition-all 
                             [&_.form-check-input:checked]:!bg-[#2F834D]"
                  disabled={isScoreMode} // disable nếu scoreMode đang bật
                />
              </div>
            );
          })}
        </div>
      </Modal.Body>

      {/* Footer: nút bắt đầu làm bài */}
      <Modal.Footer className="flex justify-center pb-6 border-0">
        <Button
          className="!w-64 !h-[58px] !bg-[#2F834D] !border-none !rounded-lg !text-[24px] !font-semibold !text-white 
                     transition-colors hover:!bg-[#246B40] max-[600px]:!w-full max-[600px]:!h-[50px]"
          onClick={() => onStart(options, subjectId)} // bắt đầu làm bài
        >
          Bắt đầu làm bài
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
