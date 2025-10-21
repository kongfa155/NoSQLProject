import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex items-center justify-center ">
      <div className="h-[70%] w-[50%] bg-white shadow-black shadow-md rounded-[8px]">
        <p className="text-center font-black text-4xl py-8">
          Trang <span className="text-[#EF4444]">không tồn tại</span>
        </p>
        <p className="text-2xl px-8 py-16 text-center">
          Ôi không! có vẻ như trang bạn đang tìm không tồn tại hoặc hiện không
          truy cập được, vui lòng chuyển đến trang khác nhé
        </p>
        <div
          onClick={() => {
            navigate("");
          }}
          className="w-[50%] h-[4rem] bg-[#6ea269] text-white mx-auto rounded-[8px] text-2xl transition-all duration-500 cursor-pointer select-none hover:scale-105 flex items-center justify-center"
        >
          Về lại trang chủ
        </div>
      </div>
    </div>
  );
}
