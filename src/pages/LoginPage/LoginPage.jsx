import "./LoginPage.css";
import quizLogo from "../../quizLogo_green.svg";
import { FaEye as EyeLogo } from "react-icons/fa";
import { RiEyeOffFill as CloseEye } from "react-icons/ri";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/action/userAction";
import { useNavigate } from "react-router-dom";

export default function     () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const account = useSelector((state) => state.user.account);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogin = async () => {
    try {
      setError("");

      const credentials = {
        username: username.includes("@") ? undefined : username,
        email: username.includes("@") ? username : undefined,
        password,
      };

      const result = await dispatch(loginUser(credentials));

      if (result?.accessToken) {
        console.log("✅ Đăng nhập thành công, điều hướng...");
        navigate("/subject/view/68eb37b1199055b25477d6f0");
      } else {
        setError("Đăng nhập thất bại.");
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setError("Đăng nhập thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div
      className="flex w-full h-screen justify-center items-center bg-gray-100"
      style={{
        backgroundImage: `url("/backGround.svg")`,
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
          <div className="mb-8 text-center text-[32px] font-black text-white select-none drop-shadow-lg">
            Đăng nhập 
          </div>

          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="Nhập email hoặc username"
            className="px-[12px] w-[90%] h-[3rem] rounded-[8px] mb-4 border border-white/50 bg-white/70"
          />

          <div className="flex flex-row items-center justify-center mb-4 rounded-[8px] border border-white/50 w-[90%] h-[3rem] bg-white/70">
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

          {error && (
            <div className="text-red-300 text-sm mb-4 w-[90%] text-left drop-shadow-lg">
              {error}
            </div>
          )}

          <div
            onClick={handleLogin}
            className="w-[70%] h-[3rem] flex justify-center items-center 
            bg-[#41563F] text-white font-semibold rounded-[8px] cursor-pointer 
            hover:bg-[#6EA269] transition-all duration-500 select-none drop-shadow-md transform 
             ease-in-out hover:scale-[1.15]"
          >
            Đăng nhập
          </div>

          {isAuthenticated && (
            <div className="mt-6 text-sm text-white">
              Đã đăng nhập với tài khoản:{" "}
              <span className="font-bold">
                {account?.email || account?.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
