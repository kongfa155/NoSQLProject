// src/pages/App.jsx

import {useState, useEffect} from "react";
import QuestionPage from "./QuestionPage/QuestionPage";
import {Button} from "react-bootstrap";
import QuestionModal from "../components/QuestionModal/QuestionModal";
import QuestionList from "../components/QuestionList/QuestionList";
import {getQuestions, deleteQuestion} from "../api/questionApi";
import SideBar from "../components/Sidebar/SideBar";
import './App.css';

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
        setQuestions((prev) => [
            ...prev,
            newQuestion
        ]);
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
        <div className="h-screen w-screen">
          {
                        <div className="fixed flex flex-col h-[100vh] w-auto">
                <SideBar collapsed={collapsed}
                    toggled={toggled}
                    handleToggleSidebar={handleToggleSidebar}/>
                <div style={
                    {

                        marginLeft: collapsed ? "80px" : "250px", // Thu gọn sidebar thì content dịch lại
                        padding: "20px",
                        flex: 1,
                        transition: "margin-left 0.3s ease",
                        overflowY: "auto"
                    }
                }>
                    {/* Nút toggle sidebar - bạn có thể đặt bất cứ đâu */} </div>
            </div>

          }
            <div className="h-full w-[85%] mx-[15%]">
                <QuestionPage></QuestionPage>
            </div>
        </div>
    );
}

export default App;
