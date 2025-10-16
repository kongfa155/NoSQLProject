import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./QuizListPage.css";
import axios from "axios";
import ModalOptionQuiz from "../../components/ModalOptionQuiz/ModalOptionQuiz";
import UserStats from "../../components/UserStats/UserStats";
import { MdExpandMore as ExpandButton } from "react-icons/md";
import CreateQuizModal from "../../components/CreateQuizModal/CreateQuizModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal"; // ✅ import đúng
import { useSelector } from "react-redux";

export default function QuizListPage() {
  const { subjectid, type } = useParams();
  const [subject, setSubject] = useState();
  const [chapters, setChapters] = useState([]);

  // Modal trạng thái
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  // Confirm modal (review)
  const [showConfirm, setShowConfirm] = useState(false);
  const [quizToReview, setQuizToReview] = useState(null);

  const navigate = useNavigate();

  // lấy thông tin user từ Redux
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const account = useSelector((state) => state.user.account);
    console.log("Test data của Redux: ", account, "Test is Authenticated: ", isAuthenticated);
  // Xác định role
  const role = account?.role || "User"; // mặc định là User nếu chưa đăng nhập
  const isAdmin = role === "Admin";
  // --- HANDLERS ---
  const handleCreateNewQuiz = () => setShowCreateQuiz(true);

  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  const handleStartQuiz = (options) => {
    if (!selectedQuiz) return;
    setShowModal(false);
    navigate(`/quizzes/${selectedQuiz._id}`, {
      state: { quiz: selectedQuiz, options: options || {} },
    });
  };

  const handleReviewQuiz = (quiz) => {
    if (!quiz) return;
    setQuizToReview(quiz);
    setShowConfirm(true);
  };

  const handleYes = () => {
    if (!quizToReview) return;
    setShowConfirm(false);
    navigate(`/quizzes/review/${quizToReview._id}`, {
      state: { mode: "latest" },
    });
  };

  const handleNo = () => {
    if (!quizToReview) return;
    setShowConfirm(false);
    navigate(`/quizzes/review/${quizToReview._id}`, {
      state: { mode: "full" },
    });
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    axios
      .get(`/api/subjects/${subjectid}`)
      .then((res) => setSubject(res.data[0]))
      .catch((err) => console.log("Lỗi khi lấy subject:", err));
  }, [subjectid]);

  useEffect(() => {
    axios
      .get(`/api/chapters/subject/${subjectid}`)
      .then((res) => setChapters(res.data))
      .catch((err) => console.log("không lấy được chapters:", err));
  }, [subjectid]);

  // --- RENDER ---
  return (
    <div className="w-full pb-24 bg-white">
      {type === "edit" && (
        <p className="px-14 text-4xl font-bold pt-4 text-gray-600">
          Quản lý môn học
        </p>
      )}
      <p
        className={`text-4xl font-black px-14 ${
          type !== "edit" ? "pt-14" : "pt-2"
        } text-[#3D763A]`}
      >
        {subject?.name}
      </p>

      {type === "edit" && (
        <div className="flex flex-row justify-between">
          <p className="px-18 text-2xl text-gray-600">Danh sách bộ đề sẵn có</p>
          <div>
            <div
              className="mx-24 bg-[#3D763A] px-6 py-4 text-white flex items-center justify-center rounded-2xl cursor-pointer select-none shadow-sm shadow-black hover:scale-105 transition-all duration-500"
              onClick={handleCreateNewQuiz}
            >
              Tạo đề
            </div>
          </div>
        </div>
      )}

      {type !== "edit" && (
        <div
          id="phantichdulieu"
          className="mt-4 p-10 rounded-[8px] border-1 w-[90%] min-h-[250px] h-[40%] mx-auto"
        >
          <UserStats />
        </div>
      )}

      {chapters?.map((chapter, i) => (
        <ChapterBox
          key={`chapter_${i}`}
          chapter={chapter}
          setSelectedQuiz={setSelectedQuiz}
          setShowModal={setShowModal}
          onReview={handleReviewQuiz}
        />
      ))}

      {/* Modal làm bài */}
      <ModalOptionQuiz
        show={showModal}
        quiz={selectedQuiz}
        onClose={handleCloseModal}
        onStart={handleStartQuiz}
      />

      {/* Modal tạo đề */}
      <CreateQuizModal
        subjectid={subjectid}
        showCreateQuiz={showCreateQuiz}
        setShowCreateQuiz={setShowCreateQuiz}
      />

      {/* ✅ Modal xác nhận review */}
      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Review"
        message="Bạn muốn xem lại lần làm bài gần nhất hay toàn bộ câu hỏi?"
        yesText="Lần gần nhất"
        noText="Nah, mình sẽ xem toàn bộ câu hỏi"
        onYes={handleYes}
        onNo={handleNo}
      />
    </div>
  );
}

// ---------------- CHAPTER BOX ----------------
function ChapterBox({ chapter, setSelectedQuiz, setShowModal, onReview }) {
  const [quizList, setQuizList] = useState([]);
  const [expandChapterBox, setExpandChapterBox] = useState(false);

  const getQuizList = async () => {
    if (quizList.length >= 1) return;
    try {
      const res = await axios.get(`/api/quizzes/chapter/${chapter._id}`);
      setQuizList(res.data);
    } catch (err) {
      console.log("Lỗi lấy quiz:", err);
    }
  };

  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  return (
    <div className="mt-8 mx-auto w-[90%] pb-4 transition-all duration-500 shadow-black shadow-sm rounded-[8px]">
      <div className="flex flex-row justify-between">
        <p className="text-4xl pt-4 px-8 text-[#3D763A]">{chapter.name}</p>
        <ExpandButton
          onClick={() => {
            getQuizList();
            setExpandChapterBox((prev) => !prev);
          }}
          className={`text-4xl hover:scale-110 transition-all duration-500 ${
            expandChapterBox && "rotate-180"
          }`}
        />
      </div>
      <div
        className={`${
          expandChapterBox ? "h-[312px]" : "h-0"
        } transition-all duration-500 overflow-hidden`}
      >
        <div className="w-full h-full pb-8 overflow-scroll">
          {quizList.map((quiz, i) => (
            <QuizBox
              key={`quiz_chapter_${i}`}
              quiz={quiz}
              onOpenModal={handleOpenModal}
              onReview={onReview}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- QUIZ BOX ----------------
function QuizBox({ quiz, onOpenModal, onReview }) {
  const { type } = useParams();

  return (
    <div className="mt-4 rounded-[8px] border border-gray-300 w-[95%] pt-4 pb-2 px-8 mx-auto flex justify-between items-center hover:shadow-md transition-all">
      <div>
        <p className="text-[24px] text-gray-700 font-light">{quiz.name}</p>
      </div>
      <div className="flex gap-3">
        {type === "view" && (
          <>
            <button
              className="border border-[#3D763A] text-[#3D763A] px-6 py-2 rounded-xl hover:bg-[#E6F4E6] transition-all"
              onClick={() => onReview(quiz)}
            >
              Review
            </button>
            <button
              className="bg-[#3D763A] text-white px-6 py-2 rounded-xl hover:bg-[#31612F] transition-all"
              onClick={() => onOpenModal(quiz)}
            >
              Làm bài
            </button>
          </>
        )}
        {type === "edit" && (
          <>
            <button className="bg-[#EF4444] text-white px-6 py-2 rounded-xl shadow-sm shadow-black hover:scale-105 transition-all duration-400">
              Xóa bài
            </button>
            <button
              className="text-[#3D763A] bg-white border-none px-6 py-2 rounded-xl shadow-sm shadow-black hover:scale-105 transition-all duration-400"
              onClick={() => onOpenModal(quiz)}
            >
              Chỉnh sửa
            </button>
          </>
        )}
      </div>
    </div>
  );
}
