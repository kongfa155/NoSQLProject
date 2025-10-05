import { useEffect, useState } from 'react';
import './QuestionPage.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function QuizListPage(){
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get("/api/quizzes")
        .then(res=>{
            setQuizzes(res.data);
        })
        .catch(err=>{
            console.log("Gap loi khi lay du lieu quizzes: ",err);
        })

    },[]);


    return (
        <div className="w-full h-full bg-white  my-4 shadow-black shadow-md">
            <h1 className="px-8">Danh sách bộ đề trắc nghiệm:</h1>
            <div className="mx-auto my-8 w-[95%] h-[80%] bg-[#F3F4F6] shadow-sm shadow-black rounded-2xl">
                <div className="h-[1rem] w-1"></div>
                <div className="bg-white mx-2 px-8 my-2 text-[1.5rem] shadow-sm shadow-black h-[4rem] grid grid-cols-5 place-items-center font-bold">
                    <p>Tên bộ đề</p> <p>Số câu</p> <p>Thời gian làm bài</p> <p>Kết quả trước đó</p>
                </div>
                    {quizzes.map((quiz, i)=>(
                    <div key={`quiz_${i}`} 
                    className="bg-white mx-2 px-8 my-2 text-[1.2rem] shadow-sm shadow-black rounded-[8px] h-auto min-h-[4rem] grid grid-cols-5 place-items-center"
                    >
                        <p>{quiz.name}</p>
                        <p>{`${quiz.questionNum} câu`}</p>
                        <p>{`${quiz.timeLimit} phút`}</p>
                        <p>NaN</p>
                        <div
                        
                        className="h-[80%] w-[50%] bg-[#6366F1]  hover:bg-[#4749d3]  transition-colors  duration-500 text-center flex items-center justify-center rounded-[8px] text-white select-none cursor-pointer"
                        onClick={()=>{
                            navigate(`/quiz/${quiz._id}`)
                        }}
                        >Làm bài</div>
                        
                    
                    </div>   

                    ))}
                
            </div>

        </div>



    );
}