import './QuestionPage.css';
import {useState, useEffect, useContext, createContext, useRef} from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

const QuizContext = createContext();
const answerMap = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G'

}
export default function QuestionPage(){
    const {id} = useParams();
    const [answer, setAnswer] = useState({});
    const [quizName, setQuizName] = useState("Bo de 1");
    const [quizTime, setQuizTime] = useState(45);
    const [quizStart, setQuizStart] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [correct, setCorrect] = useState(0); // số câu đúng


    useEffect(()=>{
        axios.get(`/api/questions/${id}`)
        .then(res=>{
            console.log("Data res: ", res);
            setQuestions(res.data);
        })
        .catch(err=>{
            console.error("Loi khi goi api: ", err);
        })

    },[]);



    return (
        <QuizContext.Provider value={"none"}>
        <div className="mt-2 mx-4 h-full w-[95%] bg-[#f5f7f7] rounded-2xl shadow-sm shadow-black">
            <div id="qh-container" className="m-4 p-2 w-full h-[4rem]">
                <QuizHeader props={{quizName,quizTime,setQuizTime, quizStart}}></QuizHeader>
            </div>
            
            <div className="mx-auto w-[98%] rounded-4xl">
                <hr></hr>
            </div>

            {(questions.length!=0)&&
                questions.map((ques,i)=>(
                    <Question key={i} ques={ques} index={i} answer={answer} setAnswer={setAnswer} setCorrect={setCorrect}></Question>

                ))
                
            }
            <p>{correct}</p>
      

        </div>

        </QuizContext.Provider>
        

    );
}




function QuizHeader({props}){
    const {quizName} = props;
    const {quizTime, setQuizTime} = props;
    const {quizStart} = props;
    useEffect(()=>{

        setInterval(
            ()=>{
                if(quizStart){
                    setQuizTime((prev)=>prev-1);
                }
                
            }, 1000
        );

    },[]);
    return (
        <div className="flex flex-col gap-1 h-full w-full "> 
            <div>
                Bộ đề: {quizName}
            </div>
            <div>
                Thời gian làm bài: {quizTime} phút
            </div>
            
        </div>
    );
}

function Question({ques, index, answer, setAnswer, setCorrect}){
    const removedScore = useRef(true);
    return (
        <div className="my-4 mx-4 rounded-[8px] overflow-hidden shadow-sm shadow-black select-none cursor-pointer">
            <div className="bg-[#4a5c97]">
                
                <p className="text-[1.2rem] text-white py-1 px-2"><span className="font-bold">Câu {index+1}:</span> {ques.question}</p>
                
            </div>
            <div className="bg-[#e5e8f1]">
                {ques.options.map((option, j)=>(
                <div key={j} className={`px-4 py-1 bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-[length:200%_100%] bg-left ${(answer[index]==option)?"bg-right":"hover:bg-right"} transition-all ease-in duration-700`}
                    onClick={()=>{
                        
                         setAnswer((prev)=>{return {...prev, [index]:option}});
                         

                         if(ques.answer==option && answer[index]!=option){
                            removedScore.current=false;
                            setCorrect((prev)=>prev+1);
                         }
                         if(ques.answer!=option && !removedScore.current){
                            removedScore.current=true;
                            setCorrect((prev)=>prev-1);
                         }
                    }}
                    
                
                
                    >{answerMap[j]}.  {option}</div>

                 ))}
            </div>
            
        </div>


    );
}