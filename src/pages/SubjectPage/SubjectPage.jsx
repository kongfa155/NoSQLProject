import './SubjectPage.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function SubjectPage(){

    const [subjects, setSubjects] = useState([]);
    const {type} = useParams();
    const navigate = useNavigate();

    // 
    useEffect(()=>{
        axios.get(`/api/subjects/`)
        .then(res=>{
            setSubjects(res.data);
            console.log("Data cua ong ne: ", res.data);
        })
        .catch(err=>{
            console.log("Gap loi khi lay subject: ",err);
        })

    },[]);





    return (
        <div className="w-full min-h-screen bg-white flex flex-col overflow-y-auto">
            <div className=" mx-24 my-32">
                <div id="subjectPageTitle" className="text-[#272b41]">
                    {(type=="view")?<h1>Làm Bài Trực Tuyến</h1>:<h1>Chỉnh Sửa Môn Học</h1>}
                    <p className="py-2">Danh sách các môn học sẵn có</p>

                 </div>


                <div className="w-[90%] mx-auto my-12 grid grid-cols-3 gap-18">
                    {subjects.map((subject,i)=>{
                        return <SubjectBox key={`subject_${i}`} navigate={navigate} subject={subject} type={type}></SubjectBox>

                    })}
                </div>
                
            </div>
            
            
        </div>

    );
}

function SubjectBox({subject, navigate, type}){
    useEffect(()=>{
        console.log(subject.image)
    },[])
    return (
        <div className="relative h-[300px] w-[100%] shadow-sm shadow-black justify-items-center overflow-hidden rounded-xl">
            <div className="h-[40%] w-full ">
                <img 
                    src={subject.image}
                    atl={`Url: ${subject.image}`}
                    className="w-full h-full object-cover object-center"                
                ></img>
            </div>
            <div className="my-2  w-full flex justify-center">
                <p className="text-center text-[1.2rem] line-clamp-1 px-4">{subject.name}</p>
            </div>
            <div className=" flex justify-center">
                <p className="text-center px-4 text-gray-700 line-clamp-2 ">{subject.description}</p>
            </div>
            {(type=="view")?
            <div 
            onClick={()=>{
                navigate(`/subject/view/${subject._id}`)
            }}
            className=" transition-colors duration-500 absolute w-[50%] h-[2rem] bg-[#6ea269] hover:bg-[#568651] bottom-2 left-1/2 -translate-x-1/2 rounded-xl flex justify-center items-center text-white cursor-pointer">
                Vào học → 
            </div>    
            :
            <div 
            onClick={()=>{
                navigate(`/subject/edit/${subject._id}`)
            }}
            className=" transition-colors duration-500 absolute w-[50%] h-[2rem] bg-[#6ea269] hover:bg-[#568651] bottom-2 left-1/2 -translate-x-1/2 rounded-xl flex justify-center items-center text-white cursor-pointer">
                Chỉnh sửa → 
            </div>
        
        }
                

                

            

        </div>


    );
}

