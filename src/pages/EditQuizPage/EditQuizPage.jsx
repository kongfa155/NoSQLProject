import { useNavigate, useParams } from "react-router-dom";
import "./EditQuizPage.css";
import { useEffect, useState } from "react";
import DefaultAlert from "../../components/AlertBoxes/DefaultAlert";
import quizService from "../../services/quizService";
import chapterService from "../../services/chapterService";
export default function EditQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSaving, setShowSaving] = useState(false);
  const [chapters, setChapters] = useState([]);

  const navigate = useNavigate();
  //Lấy quiz
  useEffect(() => {
    quizService
      .getById(id)
      .then(async (res) => {
        setQuiz(res.data);
        setQuestions(res.data.questions || []);

        const chaptersRes = await chapterService.getBySubject(
          res.data.subjectId
        );
        setChapters(chaptersRes.data);
      })

      .catch((err) => console.log("Lỗi khi tải quiz:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleQuizChange = (field, value) => {
    setQuiz((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddQuestion = (hasImage = false) => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""],
      answer: "",
      explain: "",
      image: hasImage ? "https://example.com/sample.jpg" : "",
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleDeleteQuestion = (index) => {
    if (confirm("Bạn có chắc muốn xóa câu hỏi này không?")) {
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    setShowSaving(true);
    try {
      await quizService.updateFull(id, {
        name: quiz.name,
        timeLimit: quiz.timeLimit,
        chapterId: quiz.chapterId,
        questions: questions.map((q) => ({
          _id: q._id || null,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explain: q.explain,
          image: q.image || "",
        })),
      });
      navigate(`/subject/edit/${quiz.subjectId}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật quiz:", error);
      alert("❌ Lỗi khi cập nhật quiz!");
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="w-full pb-16 text-xl flex flex-col bg-white mt-4 shadow-black shadow-sm rounded-[8px]">
      <div className="flex justify-between items-center px-8 pt-8 sticky top-0 bg-white rounded-md">
        <div>
          <input
            type="text"
            value={quiz?.name || ""}
            onChange={(e) => handleQuizChange("name", e.target.value)}
            className="text-3xl font-bold border-b-2 px-2 border-gray-400 focus:outline-none focus:border-blue-500 rounded-[8px]"
          />
          <div className="mt-3">
            Chương:{" "}
            <select
              value={quiz?.chapterId || ""}
              onChange={(e) => handleQuizChange("chapterId", e.target.value)}
              className="border border-gray-400 rounded-md p-2 ml-2"
            >
              <option value="">-- Chọn chương --</option>
              {chapters.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 rounded-[8px]">
            Thời gian làm bài (phút):{" "}
            <input
              type="number"
              value={quiz?.timeLimit || 0}
              onChange={(e) =>
                handleQuizChange("timeLimit", Number(e.target.value))
              }
              className="border border-gray-400 rounded-md p-2 w-24"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#5DC254] text-white rounded-lg hover:bg-[#548d4f] transition-all duration-700"
        >
          Lưu thay đổi
        </button>
      </div>

      <div className="w-[90%] mx-auto">
        {questions?.map((question, i) => (
          <QuestionEditBox
            key={question._id || i}
            question={question}
            i={i}
            onChange={(field, value) => handleQuestionChange(i, field, value)}
            onDelete={() => handleDeleteQuestion(i)}
          />
        ))}

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleAddQuestion(false)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Thêm câu hỏi text
          </button>
          <button
            onClick={() => handleAddQuestion(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Thêm câu hỏi có ảnh
          </button>
        </div>
      </div>
      {showSaving && (
        <DefaultAlert
          title="Đang lưu môn học"
          information="Đang lưu môn học, vui lòng chờ, quá trình này có thể kéo dài nếu bộ đề quá nhiều câu hỏi."
          closeButton={() => {
            setShowSaving(false);
          }}
        ></DefaultAlert>
      )}
    </div>
  );
}

function QuestionEditBox({ question, i, onChange, onDelete }) {
  const handleOptionChange = (optIndex, value) => {
    const updatedOptions = [...question.options];
    updatedOptions[optIndex] = value;
    onChange("options", updatedOptions);
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg mb-6 shadow-sm">
      <div className="flex justify-between">
        <p className="text-xl font-semibold mb-2">Câu {i + 1}</p>
        <button
          onClick={onDelete}
          className="text-white bg-red-400 hover:bg-red-500 transform-all duration-500 font-bold px-4 py-2 rounded-[8px] mb-4"
        >
          Xóa
        </button>
      </div>

      {/* Nội dung câu hỏi */}
      <input
        type="text"
        value={question.question}
        onChange={(e) => onChange("question", e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 mb-3"
        placeholder="Nhập nội dung câu hỏi..."
      />

      {/* Hình ảnh nếu có */}
      {question.image && (
        <div className="mb-3">
          <img
            src={question.image}
            alt="question"
            className="max-w-xs mb-2 rounded shadow"
          />
          <input
            type="text"
            value={question.image}
            onChange={(e) => onChange("image", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Đường dẫn ảnh (URL)"
          />
        </div>
      )}

      {/* Đáp án */}
      <div className="space-y-2 mb-3">
        {question.options.map((option, j) => (
          <div key={j} className="flex items-center gap-3">
            <input
              type="radio"
              checked={option === question.answer}
              onChange={() => onChange("answer", option)}
            />
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(j, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2"
              placeholder={`Đáp án ${j + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Giải thích */}
      <textarea
        value={question.explain || ""}
        onChange={(e) => onChange("explain", e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
        rows={2}
        placeholder="Giải thích (nếu có)"
      />
    </div>
  );
}
