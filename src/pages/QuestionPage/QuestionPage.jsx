import './QuestionPage.css';
import {useState, useEffect, useContext, createContext, useRef} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import DefaultAlert from '../../components/AlertBoxes/DefaultAlert';


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
    const navigate = useNavigate();
    const {id} = useParams();
    const [answer, setAnswer] = useState({});
    const [quizName, setQuizName] = useState("Bo de 1");
    const [quizTime, setQuizTime] = useState(45);
    const [quizStart, setQuizStart] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [correct, setCorrect] = useState(0); // số câu đúng
    const [submissionAlert, setSubmissionAlert] = useState(0);


    async function addSubmission(type=1){
        try{
            const data ={
                quizId: id,
                answers: answer,
                score: correct
            };
            const res = await axios.post("/api/submissions", data);
            console.log("Submission created: ", res.data);
            setSubmissionAlert(type);
        }catch(err){
            console.error("error submissions: ",err);
        }
    
    }

    useEffect(()=>{
        axios.get(`/api/questions/${id}`)
        .then(res=>{
            setQuestions(res.data);
        })
        .catch(err=>{
            setSubmissionAlert(3);
            setTimeout(()=>{
                navigate("/quiz");
            },15000);
            console.error("Loi khi goi api: ", err);
        })

    },[]);
    useEffect(()=>{
        axios.get(`/api/quizzes/${id}`)
        .then(res=>{
            console.log(res);
            setQuizName(res.data[0].name);
            setQuizTime(res.data[0].timeLimit);
            setQuizStart(true);

        })
        .catch(err=>{
            console.error(err);
        })
    },[])



    return (

        <div className="relative overflow-x-hidden mt-2 pb-20 mx-4 w-[90%] bg-gray-100 rounded-2xl shadow-sm shadow-black overflow-y-auto">

            {(submissionAlert==1)&&
            <DefaultAlert 
                title="Nộp bài" 
                information="Đã nộp bài thành công, bạn sẽ được chuyển về trang chọn bộ đề sau khi đóng thông báo này."
                closeButton={()=>{navigate("/quiz")}}
            ></DefaultAlert>
            
            }
            {(submissionAlert==2)&&
            <DefaultAlert 
                title="Nộp bài" 
                information="Đã hết giờ làm bài, hệ thống đã tự động nộp bài cho bạn. Bạn sẽ được chuyển về trang chọn bộ đề sau khi đóng thông báo này."
                closeButton={()=>{navigate("/quiz")}}
            ></DefaultAlert>
            
            }
            {(submissionAlert==3)&&
            <DefaultAlert 
                title="Bộ đề không tồn tại" 
                information="Bộ đề bạn đang truy cập không tôn tài, nhấn đóng để về trang chọn bồ đề hoặc hệ thống sẽ tự động chuyển bạn đi sau 15 giây..."
                closeButton={()=>{navigate("/quiz")}}
            ></DefaultAlert>
            
            }



            <div id="qh-container" className="m-4 p-2 w-full min-h-[4rem]">

                <QuizHeader props={{quizName,quizTime,setQuizTime, quizStart, addSubmission}}></QuizHeader>
            </div>
            
            <div className="mx-auto w-[98%] rounded-4xl">
                <hr></hr>
            </div>

            {(questions.length!=0)&&
                questions.map((ques,i)=>(
                    <Question key={i} ques={ques} index={i} answer={answer} setAnswer={setAnswer} setCorrect={setCorrect}></Question>

                ))
                
            }
            <div className="absolute right-8 grid grid-cols-2 gap-4 select-none">
                
                <div onClick={()=>{navigate("/quiz")}} className=" cursor-pointer rounded-[8px] p-4 w-[128px] text-center bg-[#EF4444] text-white font-bold">Hủy bài</div>
                <div onClick={()=>{addSubmission(1)}} className=" cursor-pointer rounded-[8px] p-4 w-[128px] text-center bg-[#10B981] text-white font-bold">Nộp bài</div>
            </div>
            

        </div>


        

    );
}




function QuizHeader({props}){
    const {quizName} = props;
    const {quizTime, setQuizTime} = props;
    const {quizStart} = props;
    const {addSubmission} = props;
    useEffect(()=>{

        const timer = setInterval(
            ()=>{
                if(quizStart){
                    setQuizTime((prev)=>{
                        if(prev==1){
                            addSubmission(2);
                            
                        }
                        if(prev-1<0){
                            return 0;
                        }
                        return prev-1;
                    });
                }
                
            }, 60000
        );
        return () => clearInterval(timer);

    },[quizStart]);
    return (
        <div className="flex flex-col gap-1 h-full w-full "> 
            <div>
                <p className="text-[1.5rem]"><span className="font-bold">Bộ đề: </span>{quizName}</p>
            
                <p className="text-[1.3rem]"><span className="font-bold">Thời gian làm bài: </span>{quizTime} phút</p>
            </div>
            
        </div>
    );
}

function Question({ques, index, answer, setAnswer, setCorrect}){

    return (
        <div className="bg-white w-[95%] mx-auto my-4 py-2 rounded-[8px] overflow-hidden shadow-sm shadow-black select-none cursor-pointer">
            <div >
                <h3 className="px-4 py-2">Trạng thái: {(answer[index]!=null)?<span className="text-[#6b7280]">Đã chọn đáp án</span>:<span className="text-[#EF4444]">Chưa chọn đáp án</span>}</h3>
                <p className="text-[1.2rem] py-1 px-4"><span className="font-bold">Câu {index+1}:</span> {ques.question}</p>
                
            </div>
            <div className="w-[98%] mx-auto ">
                {ques.options.map((option, j)=>(
                <div key={j} className={`min-h-[3rem] flex items-center shadow-md rounded-[8px] px-4 py-2 my-2 ${(answer[index]==option)?"bg-[#2563EB] text-white font-bold":"text-gray-900 bg-gray-100 hover:bg-gray-300"} transition-colors ease-in duration-200`}
                    onClick={()=>{
                        
                        setAnswer(prev=>{
                            const newAnswer = { ...prev, [index]: option };

                            if (ques.answer === option && prev[index] !== option) {
                                setCorrect(prevScore => prevScore + 1);
                            } else if (ques.answer !== option && prev[index] === ques.answer) {
                                setCorrect(prevScore => prevScore - 1);
                            }

                            return newAnswer;
                      });
                    }}
                    
                
                
                    >{answerMap[j]}.  {option}</div>

                 ))}
            </div>
            
        </div>


    );
}