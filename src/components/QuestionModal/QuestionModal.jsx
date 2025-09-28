import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { addQuestion } from "../../api/questionApi"; // gọi API trực tiếp
import styles from "./QuestionModal.module.css";

const QuestionModal = ({ show, handleClose, onSaved }) => {
    //Nhận dữ liệu từ cha bao gồm các hàm xử lý

    //Các state để lưu trữ dữ liệu câu hỏi
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); 

  //Cập nhật nội dung khi người dùng điền vào và hiển thị ngay lập tức
  const handleOptionChange = (i, value) => {
    const newOptions = [...options];
    newOptions[i] = value;
    setOptions(newOptions);
  };
  //Set đáp án đúng thành đáp án do người dùng chọn
  const handleSelectAnswer = (i) => {
    setAnswer(options[i]);
  };

  //Dùng để lưu câu hỏi lên csdl
  const handleSubmit = async (e) => {
  e.preventDefault(); //Chặn reload trang
  try {
    const res = await addQuestion({ question, options, answer }); //Gọi API add câu hỏi
    onSaved(res.data); // Trả về câu hỏi mới để cha cập nhật lại dữ liệu

    //Reset lại dữ liệu sau khi add
    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
  } catch (error) { //Xử lý khi có lỗi
    console.error("Lỗi khi lưu câu hỏi:", error);
    alert("Không thể lưu câu hỏi. Vui lòng thử lại.");
  }
};

  return (
    //Hiển thị modal khi nào
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton> 
        {/* Dấu - để đóng form khi không muốn nhập */}
        <Modal.Title>Tạo câu hỏi mới</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        {/* Chỗ này gọi hàm khi mình ấn submit nè */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className={styles.formGroup}>
            <Form.Label>Câu hỏi</Form.Label>
             {/* Nhập nội dung câu hỏi */}
            <Form.Control
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </Form.Group>
            {/* Render ra 4 chỗ nhập, xử lý nhập và nút chọn */}
          {options.map((opt, i) => (
            <Form.Group
              className={`${styles.formGroup} ${styles.optionGroup}`}
              key={i}
            >
              <div className={styles.optionRow}>
                <Form.Control
                  type="text"
                  placeholder={`Đáp án ${i + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  required
                  className={styles.optionInput}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={answer === opt}
                  onChange={() => handleSelectAnswer(i)}
                  className={styles.radioBtn}
                />
              </div>
            </Form.Group>
          ))}
            {/* Nút lưu đáp án */}
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu câu hỏi"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default QuestionModal;
