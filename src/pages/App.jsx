// src/pages/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useState, useEffect} from "react";

import QuizListPage from "./QuestionPage/QuizListPage";
import QuestionPage from './QuestionPage/QuestionPage';
import './App.css';

function App() {
    

    return (

        <div className="flex flex-row h-screen w-screen ">
            <div className="h-full w-[15%] shadow-md shadow-black my-4"></div>
            <Routes>
                <Route path="/" element={<QuizListPage></QuizListPage>}/>
                <Route path="/quiz" element={<QuizListPage></QuizListPage>} />
                <Route path="/quiz/:id" element={<QuestionPage></QuestionPage>}></Route>
                
            </Routes>
            
        </div>

    );
}

export default App;
