import './LoginPage.css';
import quizLogo from '../../quizLogo_green.svg';
import { FaEye as EyeLogo }  from "react-icons/fa";
import { useState } from 'react';
import { RiEyeOffFill as CloseEye } from "react-icons/ri";


export default function LoginPage(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    return (
    <div className="flex w-full h-full justify-center items-center">

        <div className="w-[30%] h-[50%] bg-white rounded-[15px] shadow-sm shadow-gray-700 ">
            <div className="my-[48px] text-center text-[32px] font-black text-[#6EA269] select-none ">
                Đăng nhập
            </div>

            <div className="flex justify-center items-center mt-8" >
                <input onChange={(e)=>{
                    setUsername(e.target.value)
                }} value={username} type="text" placeholder="Nhập email hoặc tên đăng nhập" 
                className="px-[12px] w-[85%] h-[3rem] rounded-[8px]"></input>
            </div>
            <div className="flex flex-row items-center justify-center mt-4  mx-auto w-[85%] h-[3rem] border-1 rounded-[8px]" >
                <input onChange={(e)=>{
                    setPassword(e.target.value)
                }} value={password} type={(showPassword)?"text":"password"} placeholder="Nhập mật khẩu" 
                className="px-[12px] w-[90%] h-full  rounded-[8px] border-0 focus:outline-none"></input>
                {
                    (!showPassword)?
                    <EyeLogo onClick={()=>{setShowPassword((prev)=>!prev)}} className="w-[48px] hover:text-gray-500"></EyeLogo>
                    :
                    <CloseEye onClick={()=>{setShowPassword((prev)=>!prev)}} className="w-[48px] hover:text-gray-500"></CloseEye>
                }
                
            </div> 
            <div className="mx-auto w-[65%] h-[3rem] flex justify-center
             items-center mb-4 bg-[#41563F] text-white mt-8 rounded-[8px]
             cursor-pointer hover:bg-[#6EA269] transition-all duration-700
             select-none">
                        Đăng nhập
            </div>
                
        </div>
                


    </div>

    );
}