import './QuestionPage.css';
import {useState, useEffect, useContext, createContext, useRef} from 'react';
import axios from 'axios';

const QuizzContext = createContext();
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
    const [answer, setAnswer] = useState({});
    const [quizzName, setQuizzName] = useState("Bo de 1");
    const [quizzTime, setQuizzTime] = useState(45);
    const [quizzStart, setQuizzStart] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [correct, setCorrect] = useState(0); // số câu đúng


    useEffect(()=>{
        axios.get("/api/questions")
        .then(res=>{
            setQuestions(res.data);
        })
        .catch(err=>{
            console.error("Loi khi goi api: ", err);
        })

    },[]);






    return (
        <QuizzContext.Provider value={"none"}>
        <div className="mt-2 mx-4 h-full w-[95%] bg-[#f5f7f7] rounded-2xl shadow-sm shadow-black">
            <div id="qh-container" className="m-4 p-2 w-full h-[4rem]">
                <QuizzHeader props={{quizzName,quizzTime,setQuizzTime, quizzStart}}></QuizzHeader>
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

        </QuizzContext.Provider>
        

    );
}




function QuizzHeader({props}){
    const {quizzName} = props;
    const {quizzTime, setQuizzTime} = props;
    const {quizzStart} = props;
    useEffect(()=>{

        setInterval(
            ()=>{
                if(quizzStart){
                    setQuizzTime((prev)=>prev-1);
                }
                
            }, 1000
        );

    },[]);
    return (
        <div className="flex flex-col gap-1 h-full w-full "> 
            <div>
                Bộ đề: {quizzName}
            </div>
            <div>
                Thời gian làm bài: {quizzTime} phút
            </div>
            
        </div>
    );
}

function Question({ques, index, answer, setAnswer, setCorrect}){
    const removedScore = useRef(false);
    return (
        <div className="my-4 mx-4 rounded-[8px] overflow-hidden shadow-sm shadow-black select-none cursor-pointer">
            <div className="bg-[#4a5c97]">
                
                <p className="text-[1.2rem] text-white py-1 px-2"><span className="font-bold">Câu {index+1}:</span> {ques.question}</p>
                
            </div>
            <div className="bg-[#e5e8f1]">
                {ques.options.map((option, j)=>(
                <div key={j} className={`px-4 py-1 ${(answer[index]==option)?"bg-[#cce4ff]":"hover:bg-blue-200"}`}
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