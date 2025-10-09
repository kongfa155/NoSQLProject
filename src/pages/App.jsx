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
import AdminPage from "./AdminPage/AdminPage"
import SettingPage from "./SettingPage/Setting";
import SmokeTrail from "../components/Effect/SmokeTrail";// 
function App() {
  const [selected, setSelected] = useState("trangchu");
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(()=>{
    const path = location.pathname;
    if(path=="/"){
      setSelected("trangchu");
    }else if(path.startsWith("/subject/view")){
      setSelected("monhoc");
    }else if(path.startsWith("/subject/edit")){
      setSelected("chinhsuamonhoc");
    }
    
    else if(path.startsWith("/donggopde")){
      setSelected("donggopde");
    }else if(path.startsWith("/login")){
      setSelected("dangnhap");
    }
    else if(path.startsWith("/admin")){
      setSelected("admin");
    }
    else{
      setSelected("");
    }
    
    
  },[location]);

  return (
    <div className="flex flex-col h-screen w-screen">
      <SmokeTrail />
      {(selected!="admin")&&
      <div className="h-[5%] w-full my-1">
        <NavBar selected={selected} isAdmin={isAdmin} />
      </div>
      }

            <div className="flex-1 overflow-y-auto">
            <Routes>
                <Route path="/" element={<AboutUs></AboutUs>}></Route>
                <Route path="/subject" element={<SubjectPage></SubjectPage>}></Route>
                <Route path="/subject/:id" element={<QuizListPage></QuizListPage>} />
                <Route path="/quiz/:id" element={<QuestionPage></QuestionPage>}></Route>
                <Route path="/login" element={<LoginPage></LoginPage>}></Route>
                <Route path="/admin" element={<AdminPage></AdminPage>}></Route>
                <Route path="/admin/settings" element={<SettingPage></SettingPage>}></Route>
            </Routes>
            </div>
            
            
        </div>

    );
}

export default App;
