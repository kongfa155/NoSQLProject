import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './QuizListPage.css'
import axios from 'axios';

export default function QuizListPage(){
    const {subjectid} = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [subject, setSubject] = useState();

    //lay du lieu subject
    useEffect(()=>{
        axios.get(`/api/subjects/${subjectid}`)
        .then(res=>{
            console.log("Data cua subject: ",res.data[0]);
            setSubject(res.data[0]);
        })
        .catch(err=>{
            console.log("Gap loi khi lay du lieu subject: ", err);
        })

    },[])

    //lay du lieu quizz
    useEffect(()=>{
        axios.get(`/api/quizzes/subject/${subjectid}`)
        .then(res=>{
            setQuizzes(res.data);
        })
        .catch(err=>{
            console.log("Khong lay duoc quizz: ",err);
        })

    },[]);



    return (
        <div className="h-full w-full bg-white">
            <p className="text-[24px] px-12 pt-4 pb-2">Môn học</p>
            <p className="text-4xl font-black px-14 text-[#3D763A] ">{subject.name}</p>
            {/*Cai phan tich cua may se la cai div o duoi nha cong pha*/}

            <div id="phantichdulieu" className="mt-4 rounded-[8px] border-1 w-[90%] h-[40%] mx-auto">
                Cái box này là cái phân tích của mày nha công pha
            </div>
            {quizzes.map((quiz,i)=>(
                <QuizzBox key={`quiz_${i}`} quiz={quiz}></QuizzBox>
            ))}
        </div>

    );
}


function QuizzBox({quiz}){
    const [showMore, setShowMore] = [false];
    
    return (
        <div className="mt-4 rounded-[8px] border-1 w-[90%] py-4 px-8 mx-auto">
            <p className="text-[24px]">{quiz.name}</p>

            
            
        </div>

    );
}