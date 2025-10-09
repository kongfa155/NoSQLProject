import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ModalOptionQuiz.module.css';

export default function ModalOptionQuiz({ show, quiz, onClose, onStart }) {
  const [options, setOptions] = useState({
    shuffleQuestions: true,
    showAnswers: true,
    shuffleOptions: false,
    rotationalPractice: true,
    timeLimit: false,
    scoreMode: false, // 🔹 Thêm chế độ làm bài tính điểm
  });

  if (!quiz) return null;

  const handleToggle = (key) => {
    // ✅ Nếu toggle "Làm bài có tính điểm"
    if (key === "scoreMode") {
      setOptions((prev) => {
        const next = !prev.scoreMode;

        if (next) {
          // Khi bật "Làm bài có tính điểm"
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
          // Khi tắt, cho phép chỉnh bình thường lại
          return { ...prev, scoreMode: false };
        }
      });
      return;
    }

    // ✅ Nếu đang ở chế độ tính điểm thì không cho đổi các option khác
    if (options.scoreMode) return;

    // ✅ Toggle bình thường
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatTime = (minutes) => {
    if (!minutes) return "00:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  return (
    <Modal show={show} onHide={onClose} centered size="xl" className={styles.customModal}>
      <Modal.Header className={styles.modalHeader}>
        <Button variant="light" onClick={onClose} style={{ borderRadius: '50%' }}>
          <IoClose size={20} />
        </Button>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        <div className={styles.lessonHeaderWrapper}>
          <div>
            <span className={styles.sectionTitleLabel}>Bài học</span>
            <h3 className={styles.lessonName}>{quiz.name}</h3>
          </div>
          <div>
            <span className={styles.sectionTitleLabel}>Thời gian làm bài</span>
            <div className={styles.timeValue}>{formatTime(quiz.timeLimit)}</div>
          </div>
        </div>

        <hr className={styles.sectionDivider} />

        <div className={styles.quizPracticeOptions}>
          {[
            { label: "Đảo câu hỏi", key: "shuffleQuestions" },
            { label: "Biết đáp án", key: "showAnswers" },
            { label: "Đảo đáp án", key: "shuffleOptions" },
            { label: "Luyện tập xoay vòng", key: "rotationalPractice" },
            { label: "Tính thời gian", key: "timeLimit" },
            { label: "Làm bài có tính điểm", key: "scoreMode" }, // 🔹 Option mới
          ].map(({ label, key }) => {
            const isScoreMode = options.scoreMode && key !== "scoreMode";
            return (
              <div className={styles.optionRow} key={key}>
                <span
                  className={isScoreMode ? styles.disabledLabel : ""}
                >
                  {label}
                </span>
                <Form.Check
                  type="switch"
                  id={key}
                  checked={options[key]}
                  onChange={() => handleToggle(key)}
                  className={styles.customToggle}
                  disabled={isScoreMode} // 🔒 Khóa switch nếu đang ở chế độ tính điểm
                />
              </div>
            );
          })}
        </div>
      </Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <Button
          className={styles.startButton}
          onClick={() => onStart(options)}
        >
          Bắt đầu làm bài
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
