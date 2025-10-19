import './NavBar.css';
import webLogo from '../../quizLogo_green.svg';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"; // thêm Link
import { FaUserCircle } from "react-icons/fa"; // thêm icon user
import { useDispatch } from "react-redux";
import { handleLogout } from "../../redux/action/userAction";

export default function NavBar({selected="trangchu"}){


      const account = useSelector((state) => state.user.account);
      const isAuthenticated = useSelector(
        (state) => state.user.isAuthenticated
      );

      const dispatch = useDispatch();
    const map = {
      trangchu: "",
      monhoc: "subject/view",
      donggopde: "donggopde",
      canhan: "login",
      chinhsuamonhoc: "subject/edit",
    };
    
    const navigate = useNavigate();
    
    function handleItemOnClick(name){
        navigate(`/${map[name]}`)
    }
    return (
      <div
        className={`w-full h-full shadow-sm  shadow-gray-400 grid grid-cols-8 justify-items-center items-center font-bold select-none  ${
          selected != "trangchu" && "bg-white"
        }`}
      >
        <div
          className="flex flex-row items-center justify-center cursor-pointer"
          onClick={() => {
            handleItemOnClick("trangchu");
          }}
        >
          <img className="w-[32px] h-[32px]" src={webLogo}></img>
          <p className="my-2">PROJECT-QUIZZES</p>
        </div>
        <div
          className={`${
            selected == "trangchu" && "text-[#6ea269]"
          } cursor-pointer transition-colors duration-500`}
          onClick={() => {
            handleItemOnClick("trangchu");
          }}
        >
          <p className="my-2">TRANG CHỦ</p>
        </div>
        {(account.role!="Admin") ? (
          <div
            className={`${
              selected == "monhoc" && "text-[#6ea269]"
            } cursor-pointer transition-colors duration-500`}
            onClick={() => {
              handleItemOnClick("monhoc");
            }}
          >
            <p className="my-2">MÔN HỌC</p>
          </div>
        ) : (
          <div
            className={`${
              selected == "chinhsuamonhoc" && "text-[#6ea269]"
            } cursor-pointer transition-colors duration-500`}
            onClick={() => {
              handleItemOnClick("chinhsuamonhoc");
            }}
          >
            <p className="my-2">CHỈNH SỬA MÔN HỌC</p>
          </div>
        )}
        <div
          className={`${
            selected == "donggopde" && "text-[#6ea269]"
          } cursor-pointer transition-colors duration-500`}
          onClick={() => {
            handleItemOnClick("donggopde");
          }}
        >
          <p className="my-2">ĐÓNG GÓP ĐỀ</p>
        </div>
        <div className="col-span-3"></div>
   <div
  className={`${
    selected == "dangnhap" && "text-[#6ea269]"
  } cursor-pointer duration-500 transform transition ease-in-out hover:scale-[1.15] flex justify-center items-center`}
>
  {isAuthenticated ? (
    <div>
      <button
        onClick={() => {handleLogout(dispatch); navigate("/login")}}
        className="px-4 py-2 font-semibold border-2 border-[#41563F] bg-[#41563F] text-white rounded-xl 
                   transition-all duration-300 ease-in-out hover:bg-gray-200 hover:text-black hover:scale-110"
      >
        ĐĂNG XUẤT
      </button>
    </div>
  ) : (
    <div
      className={`${
        selected == "dangnhap" && "text-[#6ea269]"
      } cursor-pointer duration-500 transform transition ease-in-out hover:scale-[1.15]`}
      onClick={() => {
        handleItemOnClick("canhan");
      }}
    >
      <p
        className="px-4 py-2 font-semibold border-2 border-black bg-gray-200 text-black rounded-xl 
                   transition-all duration-300 ease-in-out hover:bg-[#41563F] hover:text-white hover:scale-110"
      >
        ĐĂNG NHẬP
      </p>
    </div>
  )}
</div>
      </div>
    );

}