import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import QuestionModal from "../components/QuestionModal/QuestionModal";
import QuestionList from "../components/QuestionList/QuestionList";
import { getQuestions, deleteQuestion } from "../api/questionApi";
import logo from "../assets/bonong.png";

function App() {
    //ShowModal là hiển thị cái bảng nhập câu hỏi
  const [showModal, setShowModal] = useState(false);
  //Lấy dữ liệu ra để truyền xuống con cho con render. Lấy dữ liệu ở đây để khi có cập nhật sẽ tiến hành render lại luôn.
  const [questions, setQuestions] = useState([]);
//Lấy tất cả câu hỏi có trong db
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    //Gọi API để lấy câu hỏi
    try {
      const res = await getQuestions();//Các câu hỏi được lưu trong res.data
      setQuestions(res.data); //Gán giá trị cho state question
    } catch (err) { //Lỗi server
      console.error("Không thể load câu hỏi", err);
    }
  };

  const handleSaved = (newQuestion) => {
    //Khi thêm câu hỏi thì cập nhật lại danh sách câu hỏi
    setQuestions((prev) => [...prev, newQuestion]); //này là spread operator
    setShowModal(false); //Đóng form nhập
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q._id !== id)); //Gọi API xóa câu hỏi khỏi csdl
    } catch (err) {
      console.error("Không thể xóa câu hỏi", err);
    }
  };

  return (
    
  
       <div style={{ padding: "20px", position: "relative" }}>
      {/*  bồ nông */}
      <img
        src={logo}
        alt="Logo"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 0 10px rgba(105, 60, 60, 0.2)",
        }} />
        <Button onClick={() => setShowModal(true)}>Tạo câu hỏi mới</Button>
      {/* Nút tạo câu hỏi, ấn vào hiển thị bảng thêm câu hỏi */}
  
      <QuestionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSaved={handleSaved}
      />
      {/* Bảng thêm câu hỏi truyền cho nó các hàm để xử lý việc hiển thị và lưu */}

      <QuestionList questions={questions} onDelete={handleDelete} />
      {/* Danh sách câu hỏi, truyền cho nó danh sách các câu hỏi để hiển thị và hàm xóa để xử lý khi xóa */}
    </div>
  );
}

export default App;
