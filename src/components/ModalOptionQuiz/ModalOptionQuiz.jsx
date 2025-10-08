import { Modal, Button, Form } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './ModalOptionQuiz.module.css';

export default function ModalOptionQuiz({ show, quiz, onClose, onStart }) {
    if (!quiz) return null;

    const formatTime = (minutes) => {
        if (!minutes) return "00:00";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}`;
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg" className={styles.customModal}>
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
                        { label: "Đảo câu hỏi", id: "shuffle-questions", defaultChecked: true },
                        { label: "Biết đáp án", id: "show-answers", defaultChecked: true },
                        { label: "Đảo đáp án", id: "shuffle-options" },
                        { label: "Luyện tập xoay vòng", id: "rotational-practice", defaultChecked: true },
                        { label: "Tính thời gian", id: "time-limit" },
                    ].map(({label, id, defaultChecked}) => (
                        <div className={styles.optionRow} key={id}>
                            <span>{label}</span>
                            <Form.Check type="switch" id={id} defaultChecked={defaultChecked} className={styles.customToggle}/>
                        </div>
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer className={styles.modalFooter}>
                <Button className={styles.startButton} onClick={onStart}>Bắt đầu làm bài</Button>
            </Modal.Footer>
        </Modal>
    );
}
