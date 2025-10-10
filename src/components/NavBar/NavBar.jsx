import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import webLogo from '../../quizLogo_green.svg';


export default function NavBar({selected="trangchu", setSelected}){
    const map = {
        "trangchu":"",
        "monhoc":"subject",
        "donggopde":"",
        "canhan":"login",
    }
    
    const navigate = useNavigate();
    
    function handleItemOnClick(name){
        setSelected(name);
        navigate(`/${map[name]}`)
    }
    return (

        <div className="w-full h-full shadow-sm shadow-gray-400 grid grid-cols-8 justify-items-center
         items-center font-bold select-none bg-[#41563F]/95 text-white transition-all duration-500
         backdrop-blur-md">
            <div className="flex flex-row items-center justify-center ">
                <img className="w-[32px h-[32px]" src={webLogo}></img>
                <p>PROJECT-QUIZZES</p>
            </div>
            <div className={`${(selected=="trangchu")&&"text-[#6ea269]"} cursor-pointer transition-colors duration-500`} onClick={()=>{handleItemOnClick("trangchu")}}>
                <p>TRANG CHỦ</p>
            </div>
            <div className={`${(selected=="monhoc")&&"text-[#6ea269]"} cursor-pointer transition-colors duration-500`} onClick={()=>{handleItemOnClick("monhoc")}}>
                <p>MÔN HỌC</p>
            </div>  
            <div className={`${(selected=="donggopde")&&"text-[#6ea269]"} cursor-pointer transition-colors duration-500`} onClick={()=>{handleItemOnClick("donggopde")}}>
                <p>ĐÓNG GÓP ĐỀ</p>
            </div>
            <div className="col-span-3"></div>
            <div className={`${(selected=="dangnhap")&&"text-white"} cursor-pointer border-2 border-white rounded-lg px-4 py-1 
                    text-white hover:scale-115 hover:bg-[#6ea269]
                    transition-all duration-300 bg-[#a5a7a4]`} onClick={()=>{handleItemOnClick("canhan")}}>
                <p>ĐĂNG NHẬP</p>
            </div>
        </div>

    );

}