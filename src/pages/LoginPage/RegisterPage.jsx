//src/pages/LoginPage/RegisterPage.jsx
import "./LoginPage.css";
import quizLogo from "../../quizLogo_green.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backGround from '../../backGround.svg';
import { FaEye as EyeLogo } from "react-icons/fa";
import { RiEyeOffFill as CloseEye } from "react-icons/ri";
import authService from "../../services/authService";
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register"); // register -> otp -> done
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không trùng khớp.");
      return;
    }
    try {
      setMessage("Đang gửi mã xác minh...");
      const res = await authService.register({
        email,
        password,
      });
      setStep("otp");
      setMessage("Mã OTP đã được gửi về email của bạn!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Đăng ký thất bại.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await authService.verifyOTP({
        email,
        otp,
      });
      setStep("done");
      setMessage("✅ Xác minh thành công! Bạn có thể đăng nhập.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn."
      );
    }
  };

  return (
    <div
      className="flex w-full h-screen justify-center items-center bg-gray-100"
      style={{
        backgroundImage: `url(${backGround})`,
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

        <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-transparent">
          {step === "register" && (
            <>
              <div className="mb-8 text-center text-[32px] font-black text-white select-none drop-shadow-lg">
                Đăng ký tài khoản
              </div>

              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-[12px] w-[90%] h-[3rem] rounded-[8px] mb-4 border border-white/50 bg-white/70"
              />
              <div className="flex flex-row items-center justify-center mb-4 rounded-[8px] border border-white/50 w-[90%] h-[3rem] bg-white/70">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-[12px] w-[45%] h-full rounded-l-[8px] border-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-600"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="px-[12px] w-[45%] h-full rounded-r-[8px] border-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-600"
                />
                {showPassword ? (
                  <CloseEye
                    onClick={() => setShowPassword(false)}
                    className="w-[28px] cursor-pointer text-gray-600 hover:text-gray-800 transition-colors ml-2"
                  />
                ) : (
                  <EyeLogo
                    onClick={() => setShowPassword(true)}
                    className="w-[28px] cursor-pointer text-gray-600 hover:text-gray-800 transition-colors ml-2"
                  />
                )}
              </div>
              <div className="w-[90%] text-left mb-4 text-sm text-white/80">
                Bạn đã có tài khoản?{" "}
                <span
                  className="text-[#9DE3A4] font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </span>
              </div>
              <div
                onClick={handleRegister}
                className="w-[70%] h-[3rem] flex justify-center items-center 
                bg-[#41563F] text-white font-semibold rounded-[8px] cursor-pointer 
                hover:bg-[#6EA269] transition-all duration-500 select-none drop-shadow-md transform 
                 ease-in-out hover:scale-[1.05]"
              >
                Gửi mã xác minh
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mb-8 text-center text-[28px] font-black text-white select-none drop-shadow-lg">
                Nhập mã xác minh
              </div>

              <div className="flex justify-center mb-6">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // chỉ cho nhập 0–9 và tối đa 6 ký tự
                    setOtp(value);
                  }}
                  maxLength="6"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Nhập mã OTP"
                  className="w-[12rem] h-[3.2rem] text-center text-2xl rounded-[8px] border border-white/50 bg-white/70 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#6EA269] placeholder-gray-500"
                />
              </div>

              <div
                onClick={handleVerifyOtp}
                className="w-[70%] h-[3rem] flex justify-center items-center 
                    bg-[#41563F] text-white font-semibold rounded-[8px] cursor-pointer 
                    hover:bg-[#6EA269] transition-all duration-500 select-none drop-shadow-md transform 
                    ease-in-out hover:scale-[1.05]"
              >
                Xác nhận mã
              </div>
            </>
          )}

          {step === "done" && (
            <div className="text-white text-center text-lg font-semibold">
              Tài khoản đã xác minh! Đang chuyển hướng đến trang đăng nhập...
            </div>
          )}

          {message && (
            <div className="text-white text-sm mt-6 opacity-90">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}
