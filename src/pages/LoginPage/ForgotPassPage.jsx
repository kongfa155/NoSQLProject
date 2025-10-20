import api from "../../api/axiosInstance"; // dùng instance thay vì axios bình thường
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye as EyeLogo } from "react-icons/fa";
import { RiEyeOffFill as CloseEye } from "react-icons/ri";
import quizLogo from "../../quizLogo_green.svg";

export default function ForgotPassPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async () => {
  if (isSending) return; // tránh spam
  try {
    setError("");
    setIsSending(true);
    const res = await api.post("/auth/forgot-password", { email });
    setSuccessMsg(res.data.message);
    setStep(2);

    // Bắt đầu countdown 30s để người dùng không spam
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSending(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

  } catch (err) {
    setError(err.response?.data?.message || "Gửi OTP thất bại");
    setIsSending(false);
  }
};

  const handleVerifyOTP = async () => {
    try {
      setError("");
      const res = await api.post("/auth/verify-forgot-otp", { email, otp });
      setSuccessMsg(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "OTP không hợp lệ");
    }
  };

  const handleResetPassword = async () => {
    try {
      setError("");
      const res = await api.post("/auth/reset-password", { email, newPassword });
      setSuccessMsg(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật mật khẩu thất bại");
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gray-100"
         style={{ backgroundImage: `url("/backGround.svg")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="flex w-[70%] h-[70%] rounded-[20px] overflow-hidden shadow-2xl shadow-gray-400 backdrop-blur-md border border-white/30"
           style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}>
        <div className="w-1/2 flex justify-center items-center relative bg-white/10 border-r border-white/20">
          <img src={quizLogo} alt="Logo" className="w-[60%] opacity-90" />
          <div className="absolute bottom-6 text-white text-sm opacity-70 select-none">
            © Quiz Company
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-transparent">
          <div className="mb-8 text-center text-[28px] font-black text-white select-none drop-shadow-lg">
            Quên mật khẩu
          </div>

          {step === 1 && (
            <>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                     placeholder="Nhập email của bạn"
                     className="px-[12px] w-[90%] h-[3rem] rounded-[8px] mb-4 border border-white/50 bg-white/70"/>
              <div
                    onClick={handleSendOTP}
                    className={`w-[70%] h-[3rem] flex justify-center items-center 
                      bg-[#41563F] text-white font-semibold rounded-[8px] cursor-pointer 
                      hover:bg-[#6EA269] transition-all duration-500 select-none drop-shadow-md transform 
                      ease-in-out hover:scale-[1.05] ${isSending ? "opacity-50 cursor-not-allowed hover:bg-[#41563F]" : ""}`}
                  >
                    {isSending ? `Vui lòng chờ ${countdown}s` : "Gửi mã OTP"}
                  </div>

            </>
          )}

          {step === 2 && (
            <>
              <input value={otp} onChange={e => setOtp(e.target.value)} type="text"
                     placeholder="Nhập mã OTP"
                     className="px-[12px] w-[90%] h-[3rem] rounded-[8px] mb-4 border border-white/50 bg-white/70"/>
              <div onClick={handleVerifyOTP}
                   className="w-[70%] h-[3rem] flex justify-center items-center bg-[#41563F] text-white font-semibold rounded-[8px] cursor-pointer hover:bg-[#6EA269] transition-all duration-500 select-none drop-shadow-md transform ease-in-out hover:scale-[1.05]">
                Xác thực OTP
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex flex-row items-center justify-center mb-4 rounded-[8px] border border-white/50 w-[90%] h-[3rem] bg-white/70">
                <input value={newPassword} onChange={e => setNewPassword(e.target.value)}
                       type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu mới"
                       className="px-[12px] w-[90%] h-full rounded-[8px] border-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-600"/>
                {!showPassword ? (
                  <EyeLogo onClick={() => setShowPassword(prev => !prev)}
                           className="w-[28px] cursor-pointer text-gray-600 hover:text-gray-800 transition-colors pr-2"/>
                ) : (
                  <CloseEye onClick={() => setShowPassword(prev => !prev)}
                            className="w-[28px] cursor-pointer text-gray-600 hover:text-gray-800 transition-colors pr-2"/>
                )}
              </div>
              <div onClick={handleResetPassword}
                   className="w-[70%] h-[3rem] flex justify-center items-center bg-[#41563F] text-white font-semibold rounded-[8px] cursor-pointer hover:bg-[#6EA269] transition-all duration-500 select-none drop-shadow-md transform ease-in-out hover:scale-[1.05]">
                Cập nhật mật khẩu
              </div>
            </>
          )}

          {error && <div className="text-red-300 text-sm mt-4 w-[90%] text-left drop-shadow-lg">{error}</div>}
          {successMsg && <div className="text-green-300 text-sm mt-4 w-[90%] text-left drop-shadow-lg">{successMsg}</div>}

          <div className="mt-4 text-white text-sm cursor-pointer" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </div>
        </div>
      </div>
    </div>
  );
}
