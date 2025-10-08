// src/pages/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useState, useEffect} from "react";
import AboutUs from "./AboutUs/AboutUs";
import './App.css';
import SubjectPage from "./SubjectPage/SubjectPage";
import NavBar from "../components/NavBar/NavBar";

import LoginPage from "./LoginPage/LoginPage";
import QuizListPage from "./QuizListPage/QuizListPage";

function App() {
    const [selected, setSelected] = useState("trangchu");
    const [isAdmin, setIsAdmin] = useState(false);

    return (

        <div className="flex flex-col h-screen w-screen ">
            <div className="h-[5%] w-full my-1">
                <NavBar selected={selected} setSelected={setSelected} isAdmin={isAdmin}></NavBar>

            </div>

            <div className="flex-1 overflow-y-auto">
            <Routes>
                <Route path="/" element={<AboutUs></AboutUs>}></Route>
                <Route path="/subject/:type" element={<SubjectPage></SubjectPage>}></Route>
                <Route path="/subject/:type/:subjectid" element={<QuizListPage></QuizListPage>}></Route>
                <Route path="/login" element={<LoginPage></LoginPage>}></Route>
                
            </Routes>
            </div>
            
            
        </div>

    );
}

export default App;
