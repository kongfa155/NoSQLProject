// src/pages/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useState, useEffect} from "react";

import QuizListPage from "./QuestionPage/QuizListPage";
import QuestionPage from './QuestionPage/QuestionPage';
import './App.css';
import SubjectPage from "./SubjectPage/SubjectPage";
import NavBar from "../components/NavBar/NavBar";

function App() {
    const [selected, setSelected] = useState("trangchu");

    return (

        <div className="flex flex-col h-screen w-screen ">
            <div className="h-[5%] w-full my-1">
                <NavBar selected={selected} setSelected={setSelected}></NavBar>

            </div>

            <div className="flex-1 overflow-y-auto">
            <Routes>
                <Route path="/" element={<QuizListPage></QuizListPage>}/>
                <Route path="/subject" element={<SubjectPage></SubjectPage>}></Route>
                <Route path="/quiz" element={<QuizListPage></QuizListPage>} />
                <Route path="/quiz/:id" element={<QuestionPage></QuestionPage>}></Route>
                
            </Routes>
            </div>
            
            
        </div>

    );
}

export default App;
