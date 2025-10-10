import './LoginPage.css';
import quizLogo from '../../quizLogo_green.svg';
import { FaEye as EyeLogo } from "react-icons/fa";
import { RiEyeOffFill as CloseEye } from "react-icons/ri";
import { useState } from 'react';
import backGround from'../../../public/backGround.svg';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
   <div
  className="flex w-full h-screen justify-center items-center bg-cover bg-center"
  style={{ backgroundImage: `url(${backGround})` }}>
      {/* Khung chính */}
      <div className="flex w-[70%] h-[70%] rounded-[20px] overflow-hidden shadow-lg
       shadow-gray-400 bg-white/30 backdrop-blur-md border border-white/40">

        {/* Nửa trái - Hình ảnh */}
        <div className="w-1/2 bg-white/20 backdrop-blur-md flex
         flex-col justify-center items-center ">
          <img 
            src={quizLogo} 
            alt="Logo" 
            className="w-[60%] opacity-90"
          />
          <div className="absolute bottom-6 text-white text-sm opacity-70 select-none">
            © Quiz Company
          </div>
        </div>

        {/* Nửa phải - Form đăng nhập */}
        <div className="w-1/2 bg-white/20 backdrop-blur-md flex flex-col
         justify-center items-center">
          <div className="mb-8 text-center text-[32px] font-black text-[#6EA269] select-none">
            Đăng nhập
          </div>

          {/* Ô nhập username */}
          <div className="flex justify-center items-center mb-5 rounded-[8px] border border-gray-300 w-[75%] h-[3rem]
           transform transition-all duration-300 hover:scale-105">
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder="Nhập email hoặc tên đăng nhập"
              className="px-[12px] w-full h-full rounded-[8px] border-0 focus:outline-none"
            />
          </div>

          {/* Ô nhập password + icon ẩn/hiện */}
          <div className="flex flex-row items-center justify-center mb-8 rounded-[8px] border border-gray-300 w-[75%] h-[3rem]
         transform transition-all duration-300 hover:scale-105">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="px-[12px] w-[90%] h-full rounded-[8px] border-0 focus:outline-none"
            />
            {!showPassword ? (
              <EyeLogo
                onClick={() => setShowPassword((prev) => !prev)}
                className="w-[28px] cursor-pointer text-gray-500 hover:text-gray-700"
              />
            ) : (
              <CloseEye
                onClick={() => setShowPassword((prev) => !prev)}
                className="w-[28px] cursor-pointer text-gray-500 hover:text-gray-700"
              />
            )}
          </div>

          {/* Nút đăng nhập */}
          <div
            className="w-[60%] h-[3rem] flex justify-center items-center bg-[#41563F]
        text-white font-semibold rounded-[8px] cursor-pointer
            hover:bg-[#6EA269] hover:scale-110 transform transition-all duration-500 select-nonee"
          >
            Đăng nhập
          </div>

          <div className="mt-6 text-sm text-gray-500 select-none cursor-pointer hover:text-[#6EA269] transition-all duration-300">
            Chưa có tài khoản? Đăng ký
          </div>
        </div>
      </div>
    </div>
  );
}
