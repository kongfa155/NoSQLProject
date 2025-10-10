import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ModalOptionQuiz.module.css';

export default function ModalOptionQuiz({ show, quiz, onClose, onStart }) {
  //Này set mặc định mấy option
  const [options, setOptions] = useState({
    shuffleQuestions: true,
    showAnswers: true,
    shuffleOptions: false,
    rotationalPractice: true,
    timeLimit: false,
    scoreMode: false,
  });

  if (!quiz) return null;
//Xử lý khi một thằng thay đổi nè
  const handleToggle = (key) => {
    // Nếu mà vô thằng chế độ làm bài tính điểm
    if (key === "scoreMode") {
      setOptions((prev) => {
        const next = !prev.scoreMode;

        if (next) {
          // Set tất cả về trạng thái mình muốn khi có bật chế độ tính điểm
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
          // ScoreMode là nó không cho mất thằng khác cập nahajt
          return { ...prev, scoreMode: false };
        }
      });
      return;
    }

    //chế độ tính điểm thì không cho đổi các option khác
    if (options.scoreMode) return;

    // Đổi option mấy thằng khác nè
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  //Này dùng để format lại thời gian hiển thị cho đẹp
  const formatTime = (minutes) => {
    if (!minutes) return "00:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  return (
    //Modal ở giữa, lớn và hiển thị thông qua biến Show
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="xl"
      className={styles.customModal}
    >
        {/* Này là tiêu đề chỉ chứa mỗi nút tắt thôi */}
      <Modal.Header className={styles.modalHeader}>
        <Button
          variant="light"
          onClick={onClose}
          style={{ borderRadius: "50%" }}
        >
          <IoClose size={20} />
        </Button>
      </Modal.Header>
    {/* Thân nè */}
      <Modal.Body className={styles.modalBody}>
        {/* Phần thân trên */}
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
        {/* Thanh chia 2 phần */}
        <hr className={styles.sectionDivider} />
        {/* Phần thân dưới nè */}
        <div className={styles.quizPracticeOptions}>
          {[
            { label: "Đảo câu hỏi", key: "shuffleQuestions" },
            { label: "Biết đáp án", key: "showAnswers" },
            { label: "Đảo đáp án", key: "shuffleOptions" },
            { label: "Luyện tập xoay vòng", key: "rotationalPractice" },
            { label: "Tính thời gian", key: "timeLimit" },
            { label: "Làm bài có tính điểm", key: "scoreMode" },
          ].map(({ label, key }) => {
            //Thằng này để kiểm tra trạng thái Scoremode
            const isScoreMode = options.scoreMode && key !== "scoreMode";
            return (
                //Gán key với class
              <div className={styles.optionRow} key={key}>
                {/* Nếu mà scoreMode thì làm mờ tụi này */}
                <span className={isScoreMode ? styles.disabledLabel : ""}>
                  {label}
                </span>
                <Form.Check
                  type="switch"
                  id={key}
                  checked={options[key]}
                  onChange={() => handleToggle(key)}
                  className={styles.customToggle}
                  disabled={isScoreMode} // ScoreMode thì disable không cho đổi
                />
              </div>
            );
          })}
        </div>
      </Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <Button className={styles.startButton} onClick={() => onStart(options)}>
          Bắt đầu làm bài
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
