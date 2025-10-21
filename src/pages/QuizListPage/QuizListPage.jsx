import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./QuizListPage.css";
import axios from "axios";
import ModalOptionQuiz from "../../components/ModalOptionQuiz/ModalOptionQuiz";
import UserStats from "../../components/UserStats/UserStats";
import { MdExpandMore as ExpandButton } from "react-icons/md";
import CreateQuizModal from "../../components/CreateQuizModal/CreateQuizModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { useSelector } from "react-redux";
import ConfirmAlert from "../../components/AlertBoxes/ConfirmAlert";
import DefaultAlert from "../../components/AlertBoxes/DefaultAlert";
import subjectService from "../../services/subjectService";
import chapterService from "../../services/chapterService";
import quizService from "../../services/quizService";

export default function QuizListPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal trạng thái
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  // Confirm modal (review)
  const [showConfirm, setShowConfirm] = useState(false);
  const [quizToReview, setQuizToReview] = useState(null);

  // Redux
  const account = useSelector((state) => state.user.account);
  const role = account?.role || "User";
  const isAdmin = role === "Admin";

  // Xác định chế độ hiển thị: edit cho admin, view cho user
  const type = isAdmin ? "edit" : "view";

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
  //Đem luôn cái fetch bài làm lên đây để truyền cho stats luôn
  useEffect(() => {
    if (!subjectId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch subject
        const subjectRes = await subjectService.getById(subjectId);
        setSubject(subjectRes.data);

        // Fetch chapters
        const chaptersRes = await chapterService.getBySubject(subjectId);
        const chaptersData = chaptersRes.data;

        // Fetch quizzes cho từng chapter
        const chaptersWithQuizzes = await Promise.all(
          chaptersData.map(async (chapter) => {
            const quizRes = await quizService.getByChapter(chapter._id);
            return { ...chapter, quizzes: quizRes.data };
          })
        );

        setChapters(chaptersWithQuizzes);
      } catch (err) {
        console.error("Lỗi khi fetch subject/chapters/quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  // --- RENDER ---
  if (loading) return <p className="p-6 text-lg">Đang tải dữ liệu...</p>;

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
        {subject?.name || "Đang tải môn học..."}
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

      {type !== "edit" && chapters.length > 0 && (
        <div
          id="phantichdulieu"
          className="mt-4 p-10 rounded-[8px] border-1 w-[90%] min-h-[250px] h-[40%] mx-auto"
        >
          <UserStats
            userId={account?.id} // Redux user ID
            chapters={chapters.filter((item) => {
                return item.availability ;
            })} // chapters đã kèm quizzes
          />
        </div>
      )}

      {chapters?.map((chapter, i) => {
        if (!chapter.availability && type == "view") {
          return null;
        } else if (type == "edit" || chapter.availability) {
          return (
            <ChapterBox
              key={`chapter_${i}` || chapter._id}
              chapter={chapter}
              setSelectedQuiz={handleOpenModal}
              setShowModal={setShowModal}
              onReview={handleReviewQuiz}
              type={type}
            />
          );
        }
      })}

      <ModalOptionQuiz
        show={showModal}
        quiz={selectedQuiz}
        onClose={handleCloseModal}
        onStart={handleStartQuiz}
      />

      <CreateQuizModal
        subjectId={subjectId}
        showCreateQuiz={showCreateQuiz}
        setShowCreateQuiz={setShowCreateQuiz}
      />

      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Review"
        message="Bạn muốn xem lại lần làm bài gần nhất hay toàn bộ câu hỏi?"
        yesText="Lần gần nhất"
        noText="Xem toàn bộ câu hỏi"
        onYes={handleYes}
        onNo={handleNo}
      />
    </div>
  );
}

// ---------------- CHAPTER BOX ----------------
function ChapterBox({ chapter, setSelectedQuiz, onReview, type }) {
  const [showConfirm, setShowConfirm] = useState(0);
  const [expandChapterBox, setExpandChapterBox] = useState(false);

  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
  };
  async function handleDeleteChapter() {
    try {
      axios
        .put(`/api/chapters/${chapter._id}`, {
          availability: !chapter.availability,
        })
        .then((res) => {
          setShowConfirm(2);
        })
        .catch((err) => setShowConfirm(3));
    } catch (err) {
      setShowConfirm(3);
    }
  }
  return (
    <div className="relative p mt-8 mx-auto w-[90%] pb-16 transition-all duration-500 shadow-black shadow-sm rounded-[8px]">
      <div className="flex flex-row justify-between">
        <p className="text-4xl pt-4 px-8 text-[#3D763A]">{chapter.name}</p>
        <ExpandButton
          onClick={() => setExpandChapterBox((prev) => !prev)}
          className={`text-4xl hover:scale-110 transition-all duration-500 ${
            expandChapterBox ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`${
          expandChapterBox ? "h-[312px]" : "h-0"
        } transition-all duration-500 overflow-hidden`}
      >
        <div className="w-full h-full pb-8 overflow-scroll">
          {chapter.quizzes.map((quiz, i) => {
            if (!quiz.availability && type == "view") {
              return null;
            } else if (type == "edit" || quiz.availability) {
              return (
                <QuizBox
                  key={`quiz_chapter_${i}`|| quiz._id}
                  quiz={quiz}
                  onOpenModal={handleOpenModal}
                  onReview={onReview}
                  type={type}
                />
              );
            }
          })}
        </div>
      </div>
      {type == "edit" && (
        <button
          onClick={() => {
            setShowConfirm(1);
          }}
          className={`absolute right-8 ${
            chapter.availability ? "bg-red-600" : "bg-green-700"
          }  text-white border-none px-6 py-2 shadow-black shadow-sm rounded-xl  hover:scale-105 transition-all duration-400`}
        >
          {chapter.availability ? "Ẩn chương" : "Hiện chương"}
        </button>
      )}
      {showConfirm == 2 && (
        <DefaultAlert
          title="Thay đổi chương thành công"
          information="Đã thay đổi thành công trạng thái của chương!"
          closeButton={() => {
            window.location.reload();
          }}
        ></DefaultAlert>
      )}
      {showConfirm == 3 && (
        <DefaultAlert
          title="Thay đổi chương thất bại"
          information="Không thể thay đổi trạng thái của này, hãy thử lại sau"
          closeButton={() => {
            setShowConfirm(0);
          }}
        ></DefaultAlert>
      )}
      {showConfirm == 1 && (
        <ConfirmAlert
          confirmButton={() => {
            handleDeleteChapter();
          }}
          title="Thay đổi chương"
          information={`Bạn có chắc chắc muốn thay đổi trạng thái của chương "${chapter.name}" không?`}
          isNegative={true}
          closeButton={() => {
            setShowConfirm(0);
          }}
        ></ConfirmAlert>
      )}
    </div>
  );
}

// ---------------- QUIZ BOX ----------------
function QuizBox({ quiz, onOpenModal, onReview, type }) {
  const navigate = useNavigate();
  async function handleDeleteQuiz() {
    try {
      axios
        .put(`/api/quizzes/${quiz._id}/availability`, {
          availability: !quiz.availability,
        })
        .then((res) => {
          setShowConfirm(2);
        })
        .catch((err) => setShowConfirm(3));
    } catch (err) {
      setShowConfirm(3);
    }
  }

  const [showConfirm, setShowConfirm] = useState(0);
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
            <button
              onClick={() => {
                setShowConfirm(1);
              }}
              className={`${
                quiz.availability ? "bg-red-500" : "bg-green-600 "
              } text-white border-none px-6 py-2 shadow-black shadow-sm rounded-xl  hover:scale-105 transition-all duration-400`}
            >
              {quiz.availability ? "Ẩn bài" : "Hiện bài"}
            </button>
            <button
              className="text-[#3D763A] bg-white border-none px-6 py-2 shadow-black shadow-sm rounded-xl  hover:scale-105 transition-all duration-400"
              onClick={() => {
                navigate(`/subject/${type}/quiz/${quiz._id}`);
              }}
            >
              Chỉnh sửa
            </button>
          </>
        )}
      </div>
      {showConfirm == 2 && (
        <DefaultAlert
          title="Thay đổi bộ đề thành công"
          information="Đã thay đổi thành công trạng thái của bộ đề!"
          closeButton={() => {
            window.location.reload();
          }}
        ></DefaultAlert>
      )}
      {showConfirm == 3 && (
        <DefaultAlert
          title="Thay đổi thất bại"
          information="Không thể thay đổi bộ đề này, hãy thử lại sau"
          closeButton={() => {
            setShowConfirm(0);
          }}
        ></DefaultAlert>
      )}
      {showConfirm == 1 && (
        <ConfirmAlert
          confirmButton={() => {
            handleDeleteQuiz();
          }}
          title="Thay đổi bộ đề"
          information={`Bạn có chắc chắc muốn thay đổi trạng thái của "${quiz.name}" không?`}
          isNegative={true}
          closeButton={() => {
            setShowConfirm(0);
          }}
        ></ConfirmAlert>
      )}
    </div>
  );
}
