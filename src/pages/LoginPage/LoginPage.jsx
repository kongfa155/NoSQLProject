//src/Page/LoginPage/LoginPage.jsx
import './LoginPage.css';
import quizLogo from '../../quizLogo_green.svg';
import { FaEye as EyeLogo } from "react-icons/fa";
import { RiEyeOffFill as CloseEye } from "react-icons/ri";
import { useState } from 'react';
import axios from '../../api/axiosInstance'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

    const handleLogin = async () => {
    try {
      setError("");
      // ✅ SỬ DỤNG INSTANCE API ĐÃ CẤU HÌNH (hoặc api, tùy bạn đặt tên)
      const res = await axios.post("/auth/login", { 
          email: username,
        password
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.username);

      if (res.data.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };


  return (
    <div
      className="flex w-full h-screen justify-center items-center bg-gray-100"
      style={{
        backgroundImage: `url("/backGround.svg")`, // 🔥 chỉ cần đường dẫn tuyệt đối
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
        {/* Khung chính: GLASSMORPHISM */}
      <div 
        className="flex w-[70%] h-[70%] rounded-[20px] overflow-hidden shadow-2xl shadow-gray-400 
                   backdrop-blur-md border border-white/30" // <-- Làm mờ nền và border trắng mờ
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} // Nền trắng trong suốt (15%)
      >
        
        {/* Nửa trái - Logo (Trong suốt nhẹ) */}
        <div 
          className="w-1/2 flex justify-center items-center relative 
                   bg-white/10 border-r border-white/20" // <-- Nền trắng 10% và border chia đôi
        >
          <img src={quizLogo} alt="Logo" className="w-[60%] opacity-90" />
          <div className="absolute bottom-6 text-white text-sm opacity-70 select-none">
            © Quiz Company
          </div>
        </div>
        
        {/* Nửa phải - Form đăng nhập (Trắng tinh để dễ đọc) */}
        <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-transparent">
          
          <div className="mb-8 text-center text-[32px] font-black text-white select-none drop-shadow-lg">
            Đăng nhập
          </div>
          
          {/* Ô nhập email/username */}
          <div className="flex justify-center items-center mb-5 rounded-[8px] border border-white/50 w-[90%] h-[3rem]
           bg-white/70 focus-within:bg-white transform transition ease-in-out duration-[450ms] hover:scale-[1.05]">
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder="Nhập email"
              className="px-[12px] w-full h-full rounded-[8px] border-0 focus:outline-none bg-transparent
               text-gray-800 placeholder-gray-600 "
            />
          </div>
          
          {/* Ô nhập password + icon ẩn/hiện */}
          <div className="flex flex-row items-center justify-center mb-4 rounded-[8px] border border-white/50
           w-[90%] h-[3rem] bg-white/70 focus-within:bg-white transform 
             transition ease-in-out duration-[450ms] hover:scale-[1.05]">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="px-[12px] w-[90%] h-full rounded-[8px] border-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-600"
            />
            {!showPassword ? (
              <EyeLogo
                onClick={() => setShowPassword((prev) => !prev)}
                className="w-[28px] cursor-pointer text-gray-600 hover:text-gray-800 transition-colors pr-2"
              />
            ) : (
              <CloseEye
                onClick={() => setShowPassword((prev) => !prev)}
                className="w-[28px] cursor-pointer text-gray-600 hover:text-gray-800 transition-colors pr-2"
              />
            )}
          </div>
          
          {/* Hiển thị lỗi */}
          {error && (
            <div className="text-red-300 text-sm mb-4 w-[90%] text-left drop-shadow-lg">
              {error}
            </div>
          )}

          {/* Nút đăng nhập */}
          <div
            onClick={handleLogin}
            className="w-[70%] h-[3rem] flex justify-center items-center 
            bg-[#41563F] text-white font-semibold rounded-[8px] cursor-pointer 
            hover:bg-[#6EA269] transition-all duration-500 select-none drop-shadow-md transform 
             ease-in-out hover:scale-[1.15]"
          >
            Đăng nhập
          </div>
          
          <div className="mt-6 text-sm text-white select-none cursor-pointer hover:text-gray-200 transition-all duration-300 drop-shadow-lg">
            Chưa có tài khoản? Đăng ký
          </div>
          
        </div>
      </div>
    </div>
  );
}