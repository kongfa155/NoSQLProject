import './SubjectPage.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";//

import ConfirmAlert from '../../components/AlertBoxes/ConfirmAlert';
import CreateSubjectModal from '../../components/CreateSubJectModal/CreateSubjectModal';
import DefaultAlert from '../../components/AlertBoxes/DefaultAlert';

export default function SubjectPage(){
    const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const {type} = useParams();
    const navigate = useNavigate();
    const account = useSelector((state) => state.user.account);//

    // 
    useEffect(()=>{
        axios.get(`/api/subjects/`)
        .then(res=>{
            setSubjects(res.data);
 
        })
        .catch(err=>{
            console.log("Gap loi khi lay subject: ",err);
        })

    },[]);
    const reFetchSubjects = async ()=>{
        try{
            axios.get(`/api/subjects/`)
        .then(res=>{
            setSubjects(res.data);
 
        })
        .catch(err=>{
            console.log("Gap loi khi lay subject: ",err);
        })
        }catch(err){
            console.log("Gap loi khi lay subject: ",err);
        }

    }
    



    return (
        <div className="w-full min-h-screen bg-white flex flex-col overflow-y-auto">
            <div className=" mx-24 my-32">
                <div id="subjectPageTitle" className="text-[#272b41]">
                    {(type=="view")?<h1 className="text-[#00620B]">Làm Bài Trực Tuyến</h1>:<h1 className="text-[#00620B]">Chỉnh Sửa Môn Học</h1>}
    
                    <div className="flex flex-row justify-between">
                        <p className="mx-8">Danh sách các môn học sẵn có</p>
                   {account.role === "Admin" && (//
                        <div className="mr-24 rounded-[8px] text-2xl text-white  shadow-black px-8 py-4 select-none cursor-pointer
                        bg-[#6ea269] transition-all duration-500 hover:scale-105 hover:bg-[#5a8d56]
                        " onClick={()=>{
                            setShowCreateSubjectModal(true);

                        }}>
                            Thêm môn học</div>)};
                    </div>
                    

                 </div>


                <div className="w-[90%] mx-auto my-12 grid grid-cols-3 gap-18">
                    {subjects.length>0&&subjects.map((subject,i)=>{
                        return <SubjectBox key={`subject_${i}`} navigate={navigate} subject={subject} type={type} reFetchSubjects={reFetchSubjects}></SubjectBox>

                    })}
                </div>
                
            </div>
            {showCreateSubjectModal&&<CreateSubjectModal setShowCreateSubjectModal={setShowCreateSubjectModal}></CreateSubjectModal>}
            
        </div>

    );
}

function SubjectBox({subject, navigate, type, reFetchSubjects}){
    const [showConfirm, setShowConfirm] = useState(0);
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
            <div className="grid grid-cols-2 justify-items-center  mx-8 gap-4 my-2"> 
            <div 
            onClick={()=>{
                navigate(`/subject/edit/${subject._id}`)
            }}
            className=" transition-colors duration-500 w-full h-[2rem] bg-[#6ea269] hover:bg-[#568651] rounded-xl flex justify-center items-center text-white cursor-pointer">
                Chỉnh sửa → 
            </div>
            <div 
            onClick={()=>{
                setShowConfirm(true);
            }}
            className=" transition-colors duration-500 w-full h-[2rem] bg-[#ff6b6b] hover:bg-[#dd3f3f] rounded-xl flex justify-center items-center text-white cursor-pointer">
                Xóa ✘ 
            </div>
            
            {showConfirm==1&&
            <ConfirmAlert title="Xác nhận xóa môn học"
            information ="Bạn có chắc chắn muốn xóa môn học này không?"
            isNegative ={true}
            confirmButton={async ()=>{
                try{
                    axios.delete(`/api/subjects/${subject._id}`)
                    .then((res)=>{
                        
                        setShowConfirm(false);
                        reFetchSubjects();
                    })
                }catch(err){
                    console.log("Khong xoa duoc subject");
                }

            }}
            closeButton={()=>{setShowConfirm(0)}}
            ></ConfirmAlert>}

           
            </div>
        
        }
                

                

            

        </div>


    );
}

