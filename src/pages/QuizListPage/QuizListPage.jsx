import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './QuizListPage.css';
import axios from 'axios';
import ModalOptionQuiz from '../../components/ModalOptionQuiz/ModalOptionQuiz';
import UserStats from '../../components/UserStats/UserStats'
import { MdExpandMore as ExpandButton } from "react-icons/md";
import CreateQuizModal from '../../components/CreateQuizModal/CreateQuizModal';
export default function QuizListPage() {
  const { subjectid,type } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [subject, setSubject] = useState();
  const [chapters,setChapters]= useState([]);
// Hiển thị modal option
  const [showModal, setShowModal] = useState(false); 
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const navigate = useNavigate();

  function handleCreateNewQuiz(){
    setShowCreateQuiz(true);

  }


  //Khi ấn mở option, lưu bài người dùng chọn
  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };
  //Đóng option thì xóa bài người dùng đã chọn
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  //Này xử lý khi ấn làm bài
  const handleStartQuiz = (options) => {
    //Chưa chọn bài thì không thể làm
    if (!selectedQuiz) return;
    // Tắt modal trước khi làm
    setShowModal(false);
    // Chuyển trang + Option
    navigate(`/quiz/${selectedQuiz._id}`, {
      state: {
        quiz: selectedQuiz,
        options: options || {},
      },
    });
  };
  //Này chuyển sang review toàn bộ bài
  const handleReviewQuiz = async (quiz) => {
    if(!quiz) return;
    navigate(`/quiz/review/${quiz._id}`)
  };

  // Lấy dữ liệu subject
  useEffect(() => {
    axios.get(`/api/subjects/${subjectid}`)
      .then(res => setSubject(res.data[0]))
      .catch(err => console.log("Lỗi khi lấy subject:", err));
  }, [subjectid]);

  // Lấy dữ liệu quizzes
  // useEffect(() => {
  //   axios.get(`/api/quizzes/subject/${subjectid}`)
  //     .then(res => setQuizzes(res.data))
  //     .catch(err => console.log("Lỗi khi lấy quiz:", err));
  // }, [subjectid]);


  //Lay chapter truoc
  useEffect(()=>{
    axios.get(`/api/chapters/subject/${subjectid}`)
    .then(res=> {
      console.log(res.data);
      setChapters(res.data)
    })
    .catch(err=>console.log("khong lay dc chapters: ",err));
  }, [subjectid]);


  return (
    <div className="w-full pb-24 bg-white">
      {type=="edit"&&<p className="px-14 text-4xl font-bold pt-4 text-gray-600">Quản lý môn học</p>}
      <p className={`text-4xl font-black px-14 ${type!="edit"?"pt-14":"pt-2"} text-[#3D763A] `}>{subject?.name}</p>
      {type=="edit"&&
        <div className="flex flex-row justify-between"> 
          <p className="px-18 text-2xl  text-gray-600">Danh sách bộ đề sẵn có</p>
          <div> 
              <div 
              className="mx-24 bg-[#3D763A] px-6 py-4 
              text-white flex items-center justify-center rounded-2xl pointer-cursor 
              select-none shadow-sm shadow-black hover:scale-105 transition-all duration-500"
              onClick={()=>{
               handleCreateNewQuiz();
              }}
              >Tạo đề</div>
          </div>
        </div>
      
      }

      {type!="edit"&&
      <div id="phantichdulieu" className="mt-4 p-10 rounded-[8px] border-1 w-[90%] min-h-[250px] h-[40%] mx-auto">
            {/* Này là xài thằng Stats nè */}
        <UserStats></UserStats>

      </div>
      }

      
      {
        chapters?.map((chapter,i)=>{
          return (
            <ChapterBox key={`chapter_${i}`} chapter={chapter} setSelectedQuiz={setSelectedQuiz} setShowModal={setShowModal}>

          </ChapterBox>
          )
        })
      }


      <ModalOptionQuiz
        show={showModal}
        quiz={selectedQuiz}
        onClose={handleCloseModal}
        onStart={handleStartQuiz}
      />

      <CreateQuizModal subjectid={subjectid} showCreateQuiz={showCreateQuiz} setShowCreateQuiz={setShowCreateQuiz}></CreateQuizModal>

    </div>
  );
}
function ChapterBox({chapter, setSelectedQuiz, setShowModal}){
    const [quizList, setQuizList] = useState([]);
    const [expandChapterBox, setExpandChapterBox] = useState(false);
    const navigate = useNavigate();

    const handleReviewQuiz = async (quiz) => {
    if(!quiz) return;
    navigate(`/quiz/review/${quiz._id}`)
  };

    const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };



    async function getQuizList(){
      if(quizList.length>=1){
        return;
      }
        try{
          axios.get(`/api/quizzes/chapter/${chapter._id}`)
          .then(res=>{setQuizList(res.data)})
          .catch(err=>{console.log("Loi lay quizz: ",err)})
        }catch(err){
          console.log("Gap loi: ",err);
        }
    }

    return (
      <div className={`mt-8 mx-auto w-[90%] pb-4 transition-all duration-500 shadow-black shadow-sm rounded-[8px]`}>
          <div className="flex flex-row justify-between">
            <p className="text-4xl pt-4 px-8 text-[#3D763A]">{chapter.name}</p>
            <ExpandButton 
                    onClick={()=>{
                      getQuizList();
                      setExpandChapterBox(prev=>!prev);                      
                    }}
                    className={`text-4xl hover:scale-120 transition-alll duration-500 ${expandChapterBox&&"rotate-180"}`}></ExpandButton>
          </div>
          <div className={`${expandChapterBox?"h-[312px]":"h-0"} transition-all duration-500 overflow-hidden`}>
            {/* {quizzes.map((quiz, i) => (
        <QuizBox
          key={`quiz_${i}`}
          quiz={quiz}
          onOpenModal={handleOpenModal}
          onReview={handleReviewQuiz}
        />
      ))} */}
            <div className="w-full h-full pb-8 overflow-scroll">
                {quizList.map((quiz,i)=>(
                <QuizBox key={`quiz_chapter_${i}`} quiz={quiz} onOpenModal={handleOpenModal} onReview={handleReviewQuiz}></QuizBox>

              ))}
              
            </div>
              
          </div>
      </div>


    );



}




function QuizBox({ quiz, onOpenModal, onReview, isNew=false}) {
  useEffect(()=>{
    console.log("Quiz: ",quiz)
  },[])

  const {type} = useParams();

  if(!isNew){
    return (
    <div className="mt-4 rounded-[8px] border border-gray-300 w-[95%] pt-4 pb-2 px-8 mx-auto flex justify-between items-center hover:shadow-md transition-all">
      <div>
        <p className="text-[24px]  text-gray-700 font-light ">{quiz.name}</p>
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
  if(isNew){
    return (
    <div className="mt-4 rounded-[8px] border border-gray-300 w-[90%] py-4 px-8 mx-auto flex justify-between items-center hover:shadow-md transition-all">
      <div>
        <p className="text-[24px] font-semibold text-[#3D763A]">{quiz.name}abc</p>
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
  
}
