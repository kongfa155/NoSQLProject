import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import webLogo from '../../quizLogo_green.svg';


export default function NavBar({selected="trangchu", isAdmin}){
    const map = {
        "trangchu":"",
        "monhoc":"subject/view",
        "donggopde":"",
        "canhan":"login",
        "chinhsuamonhoc":"subject/edit"
    }
    
    const navigate = useNavigate();
    
    function handleItemOnClick(name){
        navigate(`/${map[name]}`)
    }
    return (

        <div className={`w-full h-full shadow-sm  shadow-gray-400 grid grid-cols-8 justify-items-center items-center font-bold select-none  ${selected!="trangchu"&&"bg-white"}`}>
            <div className="flex flex-row items-center justify-center cursor-pointer" onClick={()=>{handleItemOnClick("trangchu")}}>
                <img className="w-[32px] h-[32px]" src={webLogo}></img>
                <p className="my-2">PROJECT-QUIZZES</p>
            </div>
            <div className={`${(selected=="trangchu")&&"text-[#6ea269]"} cursor-pointer transition-colors duration-500`} onClick={()=>{handleItemOnClick("trangchu")}}>
                <p className="my-2">TRANG CHỦ</p>
            </div>
            {(!isAdmin)?
            <div className={`${(selected=="monhoc")&&"text-[#6ea269]"} cursor-pointer transition-colors duration-500`} onClick={()=>{handleItemOnClick("monhoc")}}>
                <p className="my-2">MÔN HỌC</p>
            </div>
            :
            <div className={`${(selected=="chinhsuamonhoc")&&"text-[#6ea269]"} cursor-pointer transition-colors duration-500`} onClick={()=>{handleItemOnClick("chinhsuamonhoc")}}>
                <p className="my-2">CHỈNH SỬA MÔN HỌC</p>
            </div>    
        }  
            <div className={`${(selected=="donggopde")&&"text-[#6ea269]"} cursor-pointer transition-colors duration-500`} onClick={()=>{handleItemOnClick("donggopde")}}>
                <p className="my-2">ĐÓNG GÓP ĐỀ</p>
            </div>
            <div className="col-span-3"></div>
            <div className={`${(selected=="dangnhap")&&"text-[#6ea269]"} cursor-pointer duration-500
            transform transition ease-in-out  hover:scale-[1.15]`} onClick={()=>{handleItemOnClick("canhan")}}>
                <p className="my-2">ĐĂNG NHẬP</p>
            </div>
        </div>

    );

}