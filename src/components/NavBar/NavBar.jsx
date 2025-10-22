import "./NavBar.css";
import webLogo from "../../quizLogo_green.svg";
import { useSelector, useDispatch } from "react-redux";
import { setViewMode } from "../../redux/action/viewModeAction";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { handleLogout } from "../../redux/action/userAction";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function NavBar({ selected = "about" }) {
  const account = useSelector((state) => state.user.account);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
const isAdmin = account?.role === "Admin";
const mode = useSelector((state) => state.viewMode?.mode || "edit");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);

  const map = {
    trangchu: "about", // -> /NoSQLProject/
    monhoc: "subject/view", // -> /NoSQLProject/subject/view
    donggopde: "donggopde", // -> /NoSQLProject/donggopde
    canhan: "login", // -> /NoSQLProject/login
    chinhsuamonhoc: "subject/edit", // -> /NoSQLProject/subject/edit
  };

  function handleItemOnClick(name) {
    navigate(map[name]); // bỏ {replace: true} nếu muốn history bình thường
  }

  function handleLogoutClick() {
    handleLogout(dispatch);
    navigate("/login"); // tương đối
    setOpenDropdown(false);
  }

  return (
    <div
      className={`w-full h-16 shadow-sm shadow-gray-400 pt-2 flex items-center justify-between font-semibold select-none ${
        selected !== "about" && "bg-white"
      }`}
    >
      {/* Nhóm trái: Logo + Menu */}
      <div className="flex items-center ml-6">
        {/* Logo + tên */}
        <div
          className="flex items-center cursor-pointer text-[20px]"
          onClick={() => handleItemOnClick("trangchu")}
        >
          <img
            className="mb-[12px] mw-[32px] h-[32px]"
            src={webLogo}
            alt="logo"
          />

          <p className="ml-2 tracking-wide">PROJECT-QUIZZES</p>
        </div>

        {/* Menu trái */}
        <div className="flex items-center gap-10 ml-6 text-[20px] tracking-[0.5px]">
          <motion.p
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            onClick={() => handleItemOnClick("trangchu")}
            className={`cursor-pointer ${
              selected === "about" ? "text-[#6ea269]" : "hover:text-[#6ea269]"
            }`}
          >
            TRANG CHỦ
          </motion.p>

          {account.role !== "Admin" ? (
            <motion.p
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              onClick={() => handleItemOnClick("monhoc")}
              className={`cursor-pointer ${
                selected === "monhoc"
                  ? "text-[#6ea269]"
                  : "hover:text-[#6ea269]"
              }`}
            >
              MÔN HỌC
            </motion.p>
          ) : (
            <motion.p
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              onClick={() => handleItemOnClick("chinhsuamonhoc")}
              className={`cursor-pointer ${
                selected === "chinhsuamonhoc"
                  ? "text-[#6ea269]"
                  : "hover:text-[#6ea269]"
              }`}
            >
              CHỈNH SỬA MÔN HỌC
            </motion.p>
          )}

          <motion.p
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            onClick={() => handleItemOnClick("donggopde")}
            className={`cursor-pointer ${
              selected === "donggopde"
                ? "text-[#6ea269]"
                : "hover:text-[#6ea269]"
            }`}
          >
            {account.role == "Admin" && "PHÊ DUYỆT ĐỀ"}
            {account.role != "Admin" && "ĐÓNG GÓP ĐỀ"}
          </motion.p>
        </div>
      </div>

      {/* Nhóm phải: user/login */}
      <div className="relative flex items-center mr-8">
        {isAdmin && (
          <div className="flex items-center gap-2 mr-10">
            <div
              className={`relative w-[130px] h-[44px] rounded-full cursor-pointer transition-all duration-300 switch-pill
                ${mode === "edit" ? "bg-[#006b3d]" : "bg-[#6ea269]"}`}
              onClick={() =>
                dispatch(setViewMode(mode === "edit" ? "view" : "edit"))
              }
            >
              <div
                className={`absolute top-[4px] w-[36px] h-[36px] bg-white rounded-full shadow-md transition-all duration-300 
                ${mode === "edit" ? "right-[4px]" : "left-[4px]"}`}
              ></div>

              <div className="absolute inset-0 text-sm font-semibold text-white select-none overflow-hidden">
                <span
                  className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    mode === "view"
                      ? "-translate-x-8 opacity-0"
                      : "translate-x-0 opacity-100"
                  }`}
                >
                  Admin
                </span>
                <span
                  className={`absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    mode === "edit"
                      ? "translate-x-8 opacity-0"
                      : "translate-x-0 opacity-100"
                  }`}
                >
                  User
                </span>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated ? (
          <div className="relative">
            <FaUserCircle
              size={36}
              className="cursor-pointer text-[#6ea269] hover:scale-110 transition-transform"
              onClick={() => setOpenDropdown(!openDropdown)}
            />

            <AnimatePresence>
              {openDropdown && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg py-2 text-sm z-50 origin-top"
                >
                  {account.role === "Admin" && (
                    <div
                      onClick={() => {
                        navigate("/admin");
                        setOpenDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    >
                      <FaUserCircle />
                      <span>Trang quản trị</span>
                    </div>
                  )}
                  <div
                    onClick={handleLogoutClick}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Đăng xuất
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className={`${
              selected === "dangnhap" && "text-[#6ea269]"
            } cursor-pointer duration-700 transform transition ease-in-out hover:scale-[1.05]`}
            onClick={() => handleItemOnClick("canhan")}
          >
            <p
              className="px-4 py-2 font-semibold border-2 border-black bg-gray-200 text-black rounded-xl 
                     transition-all duration-300 ease-in-out hover:bg-[#41563F] hover:text-white hover:scale-105"
            >
              ĐĂNG NHẬP
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
