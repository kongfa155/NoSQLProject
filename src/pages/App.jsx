import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AboutUs from "./AboutUs/AboutUs";
import "./App.css";
import SubjectPage from "./SubjectPage/SubjectPage";
import NavBar from "../components/NavBar/NavBar";
import LoginPage from "./LoginPage/LoginPage";
import QuizListPage from "./QuizListPage/QuizListPage";
import QuizPage from "./QuizPage/QuizPage"; // ✅ thêm dòng này

function App() {
  const [selected, setSelected] = useState("trangchu");
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="h-[5%] w-full my-1">
        <NavBar selected={selected} setSelected={setSelected} isAdmin={isAdmin} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AboutUs />} />
          <Route path="/subject/:type" element={<SubjectPage />} />
          <Route path="/subject/:type/:subjectid" element={<QuizListPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ✅ thêm route làm bài */}
          <Route path="/quiz/:quizid" element={<QuizPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
