import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import webLogo from '../../quizLogo.svg';


export default function NavBar({selected="trangchu", setSelected}){
    const map = {
        "trangchu":"",
        "monhoc":"subject",
        "donggopde":"",
        "canhan":"",
    }
    
    const navigate = useNavigate();
    
    function handleItemOnClick(name){
        setSelected(name);
        navigate(`/${map[name]}`)
    }
    return (

        <div className="w-full h-full shadow-sm bg-white shadow-gray-400 grid grid-cols-8 justify-items-center items-center font-bold select-none">
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
            <div className={`${(selected=="canhan")&&"text-[#6ea269]"} cursor-pointer transition-colors duration-500`} onClick={()=>{handleItemOnClick("canhan")}}>
                <p>CÁ NHÂN</p>
            </div>
        </div>

    );

}