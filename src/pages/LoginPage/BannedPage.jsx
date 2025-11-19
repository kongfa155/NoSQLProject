import bg from "/backGround.svg";
import quizLogo from "../../quizLogo_green.svg";
import { useNavigate } from "react-router-dom";

export default function BannedPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full h-screen justify-center items-center bg-gray-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="flex w-[70%] h-[70%] rounded-[20px] overflow-hidden shadow-2xl shadow-gray-400 
                    backdrop-blur-md border border-white/30"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
      >
        <div
          className="w-1/2 flex justify-center items-center relative 
                    bg-white/10 border-r border-white/20"
        >
          <img src={quizLogo} alt="Logo" className="w-[60%] opacity-90" />

          <div className="absolute bottom-6 text-white text-sm opacity-70 select-none">
            © Quiz Company
          </div>
        </div>

        {/* Cột nội dung */}
        <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-transparent">
          <div className="mb-6 text-center text-[32px] font-black text-white drop-shadow-lg select-none">
            Tài khoản bị vô hiệu hóa
          </div>

          <p className="text-white/80 text-center mb-8 w-[90%] leading-relaxed select-none">
            Tài khoản của bạn đã bị vô hiệu hóa.
            <br />
            Vui lòng liên hệ quản trị viên để nhận được hỗ trợ.
          </p>

          <div
            onClick={() => navigate("/")}
            className="w-[70%] h-[3rem] flex justify-center items-center 
                       bg-[#41563F] text-white font-semibold rounded-[8px] cursor-pointer 
                       hover:bg-[#31872D] transition-all duration-500 select-none drop-shadow-md 
                       transform ease-in-out hover:scale-[1.05]"
          >
            Quay lại trang đăng nhập
          </div>
        </div>
      </div>
    </div>
  );
}
