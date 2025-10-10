import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './QuizListPage.css';
import axios from 'axios';
import ModalOptionQuiz from '../../components/ModalOptionQuiz/ModalOptionQuiz';

export default function QuizListPage() {
  const { subjectid } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [subject, setSubject] = useState();

  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  // === CHỖ SỬA: nhận options và điều hướng kèm state ===
  const handleStartQuiz = (options) => {
    if (!selectedQuiz) return;
    // đóng modal trước
    setShowModal(false);
    // navigate và gửi cả quiz object + options
    navigate(`/quiz/${selectedQuiz._id}`, {
      state: {
        quiz: selectedQuiz,
        options: options || {},
      },
    });
  };

  const handleReviewQuiz = (quiz) => {
    console.log("Review quiz:", quiz.name);
  };

  // Lấy dữ liệu subject
  useEffect(() => {
    axios.get(`/api/subjects/${subjectid}`)
      .then(res => setSubject(res.data[0]))
      .catch(err => console.log("Lỗi khi lấy subject:", err));
  }, [subjectid]);

  // Lấy dữ liệu quizzes
  useEffect(() => {
    axios.get(`/api/quizzes/subject/${subjectid}`)
      .then(res => setQuizzes(res.data))
      .catch(err => console.log("Lỗi khi lấy quiz:", err));
  }, [subjectid]);

  return (
    <div className="w-full bg-white">
      <p className="pt-[24px] text-4xl font-black px-14 text-[#3D763A] ">{subject?.name}</p>

      <div id="phantichdulieu" className="mt-4 rounded-[8px] border-1 w-[90%] min-h-[250px] h-[40%] mx-auto">
        Cái box này là cái phân tích của mày nha công pha
      </div>

      {quizzes.map((quiz, i) => (
        <QuizzBox
          key={`quiz_${i}`}
          quiz={quiz}
          onOpenModal={handleOpenModal}
          onReview={handleReviewQuiz}
        />
      ))}


      {/* Modal popup - truyền onStart để nhận options từ modal */}
      <ModalOptionQuiz
        show={showModal}
        quiz={selectedQuiz}
        onClose={handleCloseModal}
        onStart={handleStartQuiz} // <-- đây nhận options từ ModalOptionQuiz
      />
    </div>
  );
}

function QuizzBox({ quiz, onOpenModal, onReview }) {

  const {type} = useParams();


  return (
    <div className="mt-4 rounded-[8px] border border-gray-300 w-[90%] py-4 px-8 mx-auto flex justify-between items-center hover:shadow-md transition-all">
      <div>
        <p className="text-[24px] font-semibold text-[#3D763A]">{quiz.name}</p>
      </div>

      <div className="flex gap-3">
        {type=="view"&&
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
        }
        {type=="edit"&&
        <>
        <button
          className=" bg-[#EF4444] border-none text-white px-6 py-2 rounded-xl shadow-sm shadow-black hover:scale-105 transition-all duration-400"
          onClick={() => onReview(quiz)}
        >
          Xóa bài
        </button>
        <button
          className="text-[#3D763A] bg-white border-none  px-6 py-2 rounded-xl shadow-sm shadow-black hover:scale-105 transition-all duration-400"
          onClick={() => onOpenModal(quiz)}
        >
          Chỉnh sửa
        </button>
        </>
        }

      </div>
    </div>
  );
}
