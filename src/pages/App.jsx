import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import {  useState, useEffect } from "react";
import AboutUs from "./AboutUs/AboutUs";
import "./App.css";
import SubjectPage from "./SubjectPage/SubjectPage";
import NavBar from "../components/NavBar/NavBar";
import LoginPage from "./LoginPage/LoginPage";
import QuizListPage from "./QuizListPage/QuizListPage";
import QuizPage from "./QuizPage/QuizPage"; // ✅ thêm dòng này
import NotFoundPage from "./NotFoundPage/NotFoundPage";


function App() {
  const [selected, setSelected] = useState("trangchu");
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(()=>{
    const path = location.pathname;
    if(path=="/"){
      setSelected("trangchu");
    }else if(path.startsWith("/subject")){
      setSelected("monhoc");
    }else if(path.startsWith("/donggopde")){
      setSelected("donggopde");
    }else if(path.startsWith("/login")){
      setSelected("dangnhap");
    }else{
      setSelected("");
    }
    
    
  },[location]);

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="h-[5%] w-full my-1">
        <NavBar selected={selected} isAdmin={isAdmin} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AboutUs />} />
          <Route path="/subject/:type" element={<SubjectPage />} />
          <Route path="/subject/:type/:subjectid" element={<QuizListPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ✅ thêm route làm bài */}
          <Route path="/quiz/:quizid" element={<QuizPage />} />
          <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
