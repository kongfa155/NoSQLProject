import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './QuizListPage.css';
import { MdExpandMore as ShowMoreIcon} from "react-icons/md";
import axios from 'axios';

export default function QuizListPage(){

    const {subjectid} = useParams();
    const [chapters, setChapters] = useState([]);
    const [subject, setSubject] = useState();

    //lay du lieu subject
    useEffect(()=>{
        axios.get(`/api/subjects/${subjectid}`)
        .then(res=>{
            setSubject(res.data[0]);
        })
        .catch(err=>{
            console.log("Gap loi khi lay du lieu subject: ", err);
        })

    },[])

    //lay du lieu quizz
    useEffect(()=>{
        axios.get(`/api/chapters/subject/${subjectid}`)
        .then(res=>{
            setChapters(res.data);
  
        })
        .catch(err=>{
            console.log("Khong lay duoc chapters: ",err);
        })

    },[]);



    return (
        <div className="h-full w-full bg-white">
            <p className="text-[24px] px-12 pt-4 pb-2">Môn học</p>
            <p className="text-4xl font-black px-14 text-[#3D763A] ">{subject?.name}</p>
            {/*Cai phan tich cua may se la cai div o duoi nha cong pha*/}

            <div id="phantichdulieu" className="mt-4 rounded-[8px] border-1 w-[90%] h-[40%] mx-auto">
                Cái box này là cái phân tích của mày nha công pha
            </div>
            {chapters.map((chapter,i)=>(
                <ChapterBox key={`chapter_${i}`} chapter={chapter}></ChapterBox>
            ))}
        </div>

    );
}


function ChapterBox({chapter}){
    const [showMore, setShowMore] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    
    const handleShowMore= async (chapterid)=> {
        setShowMore((prev)=>!prev)
        if(quizzes.length<=0){
            axios.get(`/api/quizzes/chapter/${chapterid}`)
            .then(res=>{
                setQuizzes(res.data);
                console.log("Data cua quizzes: ",res.data);
            })
            .catch(err=>{
                console.log("Gap loi khi lay quizz: ",err);
            
            });
            

        }
        
    }
    
    return (
        <div className={`mt-4 rounded-[8px] border-1 w-[90%] py-4 px-8 mx-auto`}>
            <div className="flex flex-row justify-between">
                <p className="text-[24px]">{chapter.name}</p>
                <div className={`text-[24px] flex items-center ${showMore?"rotate-180":""} hover:scale-125 transition-all duration-500`} onClick={()=>{handleShowMore(chapter._id)}}>
                    <ShowMoreIcon ></ShowMoreIcon>
                </div>
            </div>
            <div className={`overflow-y-auto transition-all duration-700 delay-200 ease-in-out ${showMore?"max-h-[200px]":"max-h-0"}`}>
                {
                quizzes.map((quiz,i)=>(
                    <div key={`quiz_${quiz._id}`} className={` bg-gray-200 rounded-[8px] my-2 py-2 px-8 grid grid-cols-3 justify-items-center items-center`}>
                        <p>{quiz.name}</p>
                        <p>Thanh exp của công pha</p>
                        <div className="flex flex-row justify-between gap-4 justify-self-end"> 
                            <p className="cursor-pointer select-none">Review</p>
                            <p className="cursor-pointer select-none">Làm bài</p>
                        </div>

                    </div>
                ))



            }
            </div>
            
                    
        </div>

    );
}

