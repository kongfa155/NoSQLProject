import { useState } from 'react';
import './CreateSubjectModal.css'
import stringValidater from "../../api/stringValidater";
import DefaultAlert from "../AlertBoxes/DefaultAlert";
import subjectService from '../../services/subjectService';

export default function CreateSubjectModal({setShowCreateSubjectModal}){
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription]  = useState("");
    const [showAlert, setShowAlert] = useState(0);

    async function handleCreateSubject(){
        try{
            subjectService.create({
                name: name,
                image: image,
                description: description,
                availability:true
            })
            .then((res)=>{
                setShowAlert(1);
                
            })
            .catch(err=>{
                setShowAlert(2);
            })
        }catch{
            setShowAlert(2);
        }
    }

    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-49 ">
            <div className="w-[50%] h-[50%] bg-white rounded-[8px]">
                <p className="w-full py-8 text-4xl font-black text-green-700 text-center mb-12">Tạo môn học mới</p>
                <div className="flex flex-row items-center w-[90%] mx-auto h-[4rem]">
                    <p className="my-2 text-2xl pr-8 w-[25%]">Tên môn học: </p>
                    <input value={name} onChange={(e)=>{
                        setName((prev)=>{
                            if(stringValidater(e.target.value, 1)) return e.target.value;
                            return prev;
                        })

                    }} type="text" className="flex-fill h-[3rem] rounded-[8px] text-2xl px-4"></input>
                </div>
                <div className="flex flex-row items-center w-[90%] mx-auto h-[4rem]">
                    <p className="my-2 text-2xl pr-8 w-[25%]">Url hình ảnh: </p>
                    <input value={image} onChange={(e)=>{
                        setImage(e.target.value);

                    }} type="text" className="flex-fill h-[3rem] rounded-[8px] text-2xl px-4"></input>
                </div>
                <div className="flex flex-row items-center w-[90%] mx-auto h-[4rem]">
                    <p className="my-2 text-2xl pr-8 w-[25%]">Mô tả môn học: </p>
                    <input
                    value={description} onChange={(e)=>{
                        setDescription((prev)=>{
                            if(stringValidater(e.target.value, 1)) return e.target.value;
                            return prev;
                        })

                    }}
                    type="text" className="flex-fill h-[3rem] rounded-[8px] text-2xl px-4"></input>
                </div>
                <div className="flex flex-row justify-center  gap-12 w-[50%] items-center h-[4rem] mx-auto mt-8">
                    <div className=" rounded-[8px] text-2xl text-white  shadow-black px-4 py-4 select-none cursor-pointer
                        bg-[#5DC254] transition-all duration-500 hover:scale-105 hover:bg-[#5a8d56]
                        " onClick={()=>{
                            handleCreateSubject();
                        }}>
                            Thêm môn học</div>
                        <div className=" rounded-[8px] text-2xl text-white  shadow-black px-4 py-4 select-none cursor-pointer
                        bg-[#ff6b6b] transition-all duration-500 hover:scale-105  hover:bg-[#dd3f3f]
                        " onClick={()=>{
                            setShowCreateSubjectModal(false);
                        }}>
                            Hủy bỏ</div>
                </div>
            </div>
            {showAlert==1&&<DefaultAlert title="Tạo môn thành công" information={`Đã tạo môn học ${name} thành công!`} closeButton={()=>{window.location.reload();}}></DefaultAlert>}
            {showAlert==2&&<DefaultAlert title="Tạo môn thất bại" information={`Không thể tạo môn học ${name}, vui lòng kiểm tra lại`} closeButton={()=>{setShowAlert(0)}}></DefaultAlert>}
        </div>


    );
}