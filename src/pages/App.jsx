// src/pages/App.jsx

import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import QuestionModal from "../components/QuestionModal/QuestionModal";
import QuestionList from "../components/QuestionList/QuestionList";
import { getQuestions, deleteQuestion } from "../api/questionApi";
import SideBar from "../components/Sidebar/SideBar";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await getQuestions();
      setQuestions(res.data);
    } catch (err) {
      console.error("Không thể load câu hỏi", err);
    }
  };

  const handleSaved = (newQuestion) => {
    setQuestions((prev) => [...prev, newQuestion]);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Không thể xóa câu hỏi", err);
    }
  };

  // Hàm xử lý toggle sidebar (dùng cho responsive)
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar
        collapsed={collapsed}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />
      <div
        style={{
          marginLeft: collapsed ? "80px" : "250px", // Thu gọn sidebar thì content dịch lại
          padding: "20px",
          flex: 1,
          transition: "margin-left 0.3s ease",
          overflowY: "auto",
        }}
      >
        {/* Nút toggle sidebar - bạn có thể đặt bất cứ đâu */}
        <Button
          variant="secondary"
          onClick={() => setCollapsed((prev) => !prev)}
          style={{ marginBottom: 20 }}
        >
          {collapsed ? "Mở Sidebar" : "Thu gọn Sidebar"}
        </Button>

        <Button onClick={() => setShowModal(true)} style={{ marginLeft: 10 }}>
          Tạo câu hỏi mới
        </Button>

        <QuestionModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />

        <QuestionList questions={questions} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default App;
