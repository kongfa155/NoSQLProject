// src/pages/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useState, useEffect} from "react";
import AboutUs from "./AboutUs/AboutUs";
import QuizListPage from "./QuestionPage/QuizListPage";
import QuestionPage from './QuestionPage/QuestionPage';
import './App.css';
import SubjectPage from "./SubjectPage/SubjectPage";
import NavBar from "../components/NavBar/NavBar";
import LoginPage from "./LoginPage/LoginPage";
import AdminPage from "./AdminPage/AdminPage"
import SettingPage from "./SettingPage/Setting";
import SmokeTrail from "../components/Effect/SmokeTrail";// thí nghiệm quá học của huynnui
function App() {
    const [selected, setSelected] = useState("trangchu");

    return (
        <div className="relative w-full h-full">
      <SmokeTrail />
      

        <div className="relative z-10 flex flex-col h-screen w-screen ">
            <div className="h-[5%] w-full my-1">
                <NavBar selected={selected} setSelected={setSelected}></NavBar>

            </div>

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
    </div>
    );
}

export default App;
