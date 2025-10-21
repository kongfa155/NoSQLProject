import { IoMdCheckmarkCircleOutline as CheckIcon } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <div className=" w-[95%] mx-auto mt-2 rounded-xl shadow-md shadow-gray-500 pb-8">
      <div id="aboutUs_title" className="py-12 w-[80%] mx-auto text-center">
        <p className="px-[10%] text-6xl font-black">
          Sứ mệnh của chúng mình:{" "}
          <span className="text-[#6ea269]">
            Giúp đỡ cộng đồng cùng nhau ôn luyện
          </span>{" "}
        </p>
        <p className="text-gray-700 py-4 px-[5%] text-xl">
          Chúng mình cùng nhau xây dựng nền tảng này với mục tiêu biến việc thu
          thập tài liệu, quản lý điểm số môn học một cách đơn giản và hiệu quả
          hơn bao giờ hết.
        </p>
      </div>

      <div className="h-[2px] w-[80%] mx-auto bg-gray-400"></div>

      <p className=" p-8 text-4xl font-black">Nơi Câu Chuyện Bắt Đầu</p>
      <div className="w-[90%] mx-auto shadow-md shadow-gray-500 rounded-xl  text-gray-700">
        <p className="p-8 ">
          Project-Quizzes được sinh ra để giải quyết một vấn đề thường gặp đó
          chính là việc thu thập tài liệu học tập dường như rất khó khăn và cũng
          không mấy hiệu quả nếu chỉ có một hoặc một vài nhóm người thu thập.
          <br />
          <br />
          Từ ý tưởng bân đầu đó , dự án của chúng mình tạo ra với mục tiêu đó
          chính là xây dựng nên một cộng đồng cùng nhau thu thập tài liệu học
          tập đối với các môn học ở CTU, có thể mở rộng ở tương lai xa nào đó.
          Nếu mà chỉ có thu thập đề và làm bài thì có vẻ khá đơn giản và cũng có
          nhiều nên tảng khác đã có rồi vì thế chúng mình muốn đem lại thêm các
          tính năng hỗ trợ việc học khác như là theo dỏi tiến trình học tập,
          phân tích tiến độ giải đề của bạn để xem rằng liệu bạn có đang tiến bộ
          qua việc giải đề hay không.
        </p>
        <div className="px-8 flex flex-row items-center gap-1">
          <CheckIcon className="text-[#6ea269] text-2xl"></CheckIcon>
          <p className="text-[#6ea269] text-2xl font-black">Tầm nhìn</p>
        </div>
        <div className="px-8 py-4">
          <p>Phát triển dự án trên tinh thần hướng đến cộng đồng.</p>
          <p>
            Xây dựng một cộng đồng chia sẻ tài liệu trắc nghiệm chất lượng cao.
          </p>
        </div>
        <div className="h-[2rem] w-1"></div>
      </div>

      {!isAuthenticated ? (
        <div className="my-8 pb-12 w-[90%] mx-auto shadow-md shadow-gray-500 rounded-xl  flex flex-col justify-center items-center ">
          <p className="mt-8 font-black text-4xl ">Sẵn Sàng Tham Gia?</p>
          <p className="py-4 text-gray-700 ">
            Tham gia cùng những người khác để tạo trải nghiệm làm bài kiểm tra
            ngay trong hôm nay. Hoàn toàn miễn phí cho việc khởi tạo!
          </p>
          <div
            className="rounded-2xl text-xl font-black shadow-sm shadow-black
                mx-auto px-6 py-2 text-white bg-[#6ea269] flex items-center
                hover:bg-[#4d7c48] hover:scale-105 transition-all duration-500
                cursor-pointer select-none
                "
            onClick={() => {
              navigate("/register");
            }}
          >
            Tạo Tài Khoản Ngay
          </div>
        </div>
      ) : (
        <div className="my-8 pb-12 w-[90%] mx-auto shadow-md shadow-gray-500 rounded-xl flex flex-col justify-center items-center ">
          <p className="mt-8 font-black text-4xl ">Sẵn Sàng Tham Gia?</p>
          <p className="py-4 text-gray-700 ">
            Tham gia cùng những người khác để tạo trải nghiệm làm bài kiểm tra
            ngay trong hôm nay. Hoàn toàn miễn phí cho việc khởi tạo!
          </p>
          <div
            className="rounded-2xl text-xl font-black 
                mx-auto px-6 py-2 text-gray-400 bg-[#dfdfdf] flex items-center
                 
                cursor-pointer select-none
                "
          >
            Bạn đã đăng nhập rồi
          </div>
        </div>
      )}
    </div>
  );
}
