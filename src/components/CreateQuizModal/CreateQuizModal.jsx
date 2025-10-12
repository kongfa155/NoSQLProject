import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import './CreateQuizModal.css';
import axios from 'axios';
import stringValidater from "../../api/stringValidater";
import { MdExpandMore as ExpandButton } from "react-icons/md";
import { ImCross as ExitIcon} from "react-icons/im";
import DefaultAlert from "../AlertBoxes/DefaultAlert"



export default function CreateQuizModal({subjectid, showCreateQuiz, setShowCreateQuiz}){
    const questionsRefs = useRef([]);   
    const [showAlert, setShowAlert] = useState(false);
    const [quizName, setQuizName] = useState("");
    const [chapterName, setChapterName] = useState("")
    const [selectedChapter, setSelectedChapter] = useState(false);
    const [expandChapter, setExpandChapter] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [prevChapterName, setPrevChapterName] = useState("");
    const [questionCount, setQuestionCount] = useState(1);
    const [chapterDesc, setChapterDesc] = useState("");
    const [timeLimit, setTimeLimit] = useState(45);

    const handleOnClickChapter= (chapter)=>{
        
        setChapterName(chapter.name);
        setSelectedChapter(true);
    }

    useEffect(()=>{
        axios.get(`/api/chapters/subject/${subjectid}`)
        .then(res=>{
            setChapters(res.data);

        })
        .catch(err=>{
            console.log("Gap loi khi lay chapter: ", err);
        })
    },[]);
        
    
    async function createQuiz() {
  try {
    const questionList = questionsRefs.current.map((ref) => ref?.getQuestionData());


    let chapterId = null;
    if (!selectedChapter) {
      const chapterRes = await axios.post("/api/chapters", {
        name: chapterName,
        subjectId: subjectid,
        order: chapters?.length,
        description: chapterDesc,
        availability: true,
      });
      chapterId = chapterRes.data._id;
    } else {
      const foundChapter = chapters.find((ch) => ch.name === chapterName);
      chapterId = foundChapter?._id;
    }

    if (!chapterId) {
      console.error("Không thể tạo hoặc tìm thấy chapter");
      return;
    }


    const quizRes = await axios.post("/api/quizzes", {
      name: quizName,
      subjectId: subjectid,
      chapterId: chapterId,
      questionNum: questionCount,
      timeLimit: timeLimit,
      availability: true,
    });

    const quizId = quizRes.data._id;


    await Promise.all(
        questionList.map((q) => {
            const payload = {
            quizId: quizId,
            question: q.question,
            options: q.options,
            explain: q.explain,
            answer: q.answer, 
            };

            if (q.type === "image") {
                payload.image = q.imageURL;
                return axios.post("/api/questionImages", payload);
            } else {
                return axios.post("/api/questions", payload);
            }
        })
        );
    setShowAlert(true);
    console.log("Tao de thanh cong");
  } catch (err) {
    console.error("Loi tao de ", err);

  }
}

    if(!showCreateQuiz){
        return <></>;
    }
    return (
        <div 
   
        className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 ">
            
            <div className="relative w-[50%] h-[70%] bg-white rounded-[8px] shadow-black shadow-md pb-[96px] overflow-y-auto ">
                <div className="sticky top-0 right-0 flex justify-end p-4 bg-white z-10">
                <ExitIcon 
                onClick={()=>{setShowCreateQuiz(false)}}
                className="text-[24px] hover:scale-120 transtion-all duration-500"></ExitIcon>
                </div>
                <div className="flex flex-row gap-4 w-full items-center justify-center pt-2" > 
                    <p className="px-8 w-[30%] text-2xl pt-8">Tên bộ đề: </p>
                    <input type="text" className="flex-grow mr-8 text-2xl py-2 px-4 rounded-[8px]" 
                    value={quizName}
                    onChange={(e)=>setQuizName((prev)=>{
                        if(stringValidater(e.target.value,2)) return e.target.value;
                        return prev;
                    })}
                    ></input>
                </div>
                <div className="flex flex-row gap-4 w-full items-center justify-center pt-2" > 
                    <p className="px-8 w-[30%] text-2xl pt-8">Thời gian làm bài: </p>
                    <input type="number" className="flex-grow mr-8 text-2xl py-2 px-4 rounded-[8px]" 
                    value={timeLimit}
                    onChange={(e)=>setTimeLimit((prev)=>{
                        if(stringValidater(e.target.value,2)) return e.target.value;
                        return prev;
                    })}
                    ></input>
                </div>
                <div className="flex flex-row gap-4 w-full items-center justify-center pt-2" > 
                    <p className="px-8 w-[30%] text-2xl pt-8">Thuộc chương: </p>
                    <div className="flex-grow">

                    <input type="text" className="w-[80%] mr-8 text-2xl py-2 px-4 rounded-[8px]" 
                    disabled={selectedChapter}
                    value={chapterName}
                    onChange={(e)=>setChapterName((prev)=>{
                        if(stringValidater(e.target.value,2)) return e.target.value;
                        return prev;
                    })}
                    ></input>
                    <ExpandButton 
                    onClick={()=>{
                        setPrevChapterName(chapterName);
                        setExpandChapter((prev)=>{
                            if(prev){
                                setChapterName(prevChapterName);
                                return !prev;
                            }
                            return !prev;
                        });
                        setSelectedChapter(false); 
                        

                    }}
                    className={`text-4xl hover:scale-120 transition-alll duration-500 ${expandChapter&&"rotate-180"}`}></ExpandButton>
                    
                    </div>
                   
                    
                </div>
                 {!selectedChapter&&
                    
                    <div className="flex flex-row gap-4 w-full items-center justify-center pt-2" > 
                    <p className="px-8 w-[30%] text-2xl pt-8">Mô tả chương: </p>
                    <input type="text" className="flex-grow mr-8 text-2xl py-2 px-4 rounded-[8px]" 
                    value={chapterDesc}
                    onChange={(e)=>setChapterDesc((prev)=>{
                        if(stringValidater(e.target.value,2)) return e.target.value;
                        return prev;
                    })}
                    ></input>
                </div>
                    
                    }
                <div className={`mt-4 mx-auto rounded-[8px] w-[90%] ${expandChapter?"h-[348px]":"h-0"} shadow-sm bg-gray-50 shadow-black transition-all duration-500 overflow-y-auto`}>
                    {chapters?.map((chapter,i)=>{
                        return (
                        <div 
                        onClick={()=>{handleOnClickChapter(chapter)}}
                        key={`chapter_${i}`} className="transition-all duration-200 mt-4 hover:bg-[#75b971] text-gray-700 hover:text-white flex items-center pt-4 mx-auto w-[95%]  rounded-[8px] bg-white shadow-sm shadow-gray-700 px-4 ">
                            <p className="text-2xl   ">{chapter.name}</p>
                        </div>)
                        
                    })}

                </div>
                

                
                
                
                {Array.from({length: questionCount}).map((_,i)=>{
                    return (
                   
                        <NewQuestion key={`question_${i}`} ref={(element)=>(questionsRefs.current[i]=element)} index={i}></NewQuestion>

                    )
                })}



                    <button
                    onClick={()=>{
                        setQuestionCount((prev)=>prev+1);

                    }}
                    className=" absolute right-8  mt-4 text-white bg-[#3D763A] px-4 py-2 rounded-[8px] ">
                    Thêm câu hỏi 
                </button>


                <div className="w-1 h-[2rem] "></div>
                <button 
                onClick={()=>{
                    createQuiz();
                }}  
                className="absolute my-14  right-8 text-white bg-[#3D763A] px-8 py-2 rounded-[8px] ">
                    Tạo đề
                </button>
                <div className="w-1 h-[2rem] "></div>
            </div>
               
            
                {showAlert&&<DefaultAlert title="Tạo đề thành công" information="Đã tạo đề thành công, hãy nhấn đóng để về trang quản lý"
                closeButton={()=>{
                    window.location.reload();
                    setShowAlert(false);

                }}
                
                ></DefaultAlert>}
        </div>

    );
}

const NewQuestion = forwardRef((props,ref)=>{
    const [type,setType] = useState("text");
    const {index} = props;
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [options, setOptions] = useState(["",""]);
    const [explain,setExplain] = useState("");
    const [imageURL, setImageURL] = useState("");
    
    const [showImageURL, setShowImageURL] = useState(false);

    useEffect(() => {
       
        const currentAnswerIsValid = answer && options.includes(answer);

        if (!currentAnswerIsValid) {

            const firstValidOption = options.find(opt => opt && opt.trim() !== '') || '';
            setAnswer(firstValidOption);
        }
    }, [options]);



    useImperativeHandle(ref, ()=>({
        getQuestionData: ()=>({
            type, question, options,explain,imageURL,answer
        })
    }));



   return (
    <div
        className="relative mt-4 mx-auto w-[90%] h-[300px] px-4  border-1 rounded-[8px] flex-col overflow-y-auto pb-4">
         <div className="flex flex-row mt-4 items-center ">
            <p className="w-[30%] text-[1rem] pt-4 ">Đây là câu hỏi dạng ảnh?  </p>
            <input
            onClick={()=>{setShowImageURL((prev)=>{
                if(!prev){
                    setType("image");
                }else if(prev){
                    setType("text");
                    setImageURL("");
                }
                return !prev;
            })}}
            type="checkbox" className="w-[2rem] h-[2rem] "></input>
        </div>
        {
            showImageURL&&
            <>
            <div className="flex flex-row mt-4 items-center ">
            <p className="w-[15%] text-[1rem] pt-4 ">URL của ảnh: </p>
            <input 
            onChange={(e)=>setImageURL((prev)=>{
                        return e.target.value;
                        
                    })}
            type="text" value={imageURL} className="flex-grow px-4 py-2 rounded-[8px] "></input>
            </div>
            </>
        }


        <div className="flex flex-row mt-4 items-center ">
            <p className="w-[15%] text-[1rem] pt-4 ">Câu hỏi {index+1}: </p>
            <input 
            onChange={(e)=>setQuestion((prev)=>{
                        if(stringValidater(e.target.value,2)) return e.target.value;
                        return prev;
                    })}
            type="text" value={question} className="flex-grow px-4 py-2 rounded-[8px] "></input>
        </div>
        {options.map((option, index)=>{
           return (
            <div key={`option_${index}`} className="flex flex-row mt-4 items-center ">
            <p className="w-[15%] text-[1rem] pt-4 ">Lựa chọn {index+1}: </p>
            <input 
            onChange={(e) =>
                setOptions((prev) => {
                  const newOptions = [...prev];
                  if (stringValidater(e.target.value, 2))
                    newOptions[index] = e.target.value;
                  return newOptions;
                })
              }

            type="text" value={option} className="flex-grow px-4 py-2 rounded-[8px] "></input>
        </div>
           )
        })}

        <div className=" absolute right-4 flex flex-row gap-4">

            <button
            onClick={()=>{
                setOptions((prev)=>{
                    const newOptions=[...prev, ""];
                    return newOptions;
                })
            }}
            className="mt-4 text-white bg-[#3D763A] px-4 py-2 rounded-[8px] ">Thêm lựa chọn</button>
        </div>
        <div className="h-[4rem] w-1"></div>
        <div className="flex flex-row mt-4 items-center ">
            <p className="w-[15%] text-[1rem] pt-4 ">Chọn đáp án: </p>
            <select  value={answer} onChange={(e) => setAnswer(e.target.value)}  name="optionsList" className="flex-grow max-w-[85%] bg-white px-4 py-2 rounded-[8px]">
                {options.map((option,index)=>{
                    return (<option key={`option_select_${index}`} value={option}>{option}</option>);
                })}

            </select>
        </div>

    <div className="flex flex-row mt-4 items-center ">
            <p className="w-[15%] text-[1rem] pt-4 ">Giải thích: </p>
            <input 
            onChange={(e)=>setExplain((prev)=>{
                        if(stringValidater(e.target.value,2)) return e.target.value;
                        return prev;
                    })}
            type="text" value={explain} className="flex-grow px-4 py-2 rounded-[8px] "></input>
        </div>


        
    </div>)
    
    
    
    

}

)