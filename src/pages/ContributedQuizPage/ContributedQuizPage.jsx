import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdExpandMore as ExpandButton } from "react-icons/md";
import ContributedQuizList from "../../components/ContributedQuizList/ContributedQuizList";
import contributedService from "../../services/contributedService";
import subjectService from "../../services/subjectService";
import chapterService from "../../services/chapterService";

export default function ContributedQuizPage() {
  const { account, isAuthenticated } = useSelector((state) => state.user);
  const mode = useSelector((state) => state.viewMode.mode);

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [expandSubject, setExpandSubject] = useState(false);
  const [expandChapter, setExpandChapter] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const [suggestedNote, setSuggestedNote] = useState("");
  const [quizName, setQuizName] = useState("");
  const [contributionStats, setContributionStats] = useState(null);

  const subjectRef = useRef(null);
  const chapterRef = useRef(null);

  // Fetch contribution stats
  useEffect(() => {
    if (!isAuthenticated || !account?.accessToken) return;
    contributedService
      .getStats()
      .then((res) => setContributionStats(res.data))
      .catch((err) => console.error("Lỗi khi lấy thống kê:", err));
  }, [isAuthenticated, account?.accessToken]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectRef.current && !subjectRef.current.contains(event.target)) {
        setExpandSubject(false);
      }
      if (chapterRef.current && !chapterRef.current.contains(event.target)) {
        setExpandChapter(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch subjects
  useEffect(() => {
    subjectService
      .getAll()
      .then((res) => setSubjects(res.data || []))
      .catch((err) => console.error("Lỗi khi lấy danh sách môn học:", err));
  }, []);

  // Fetch chapters for selected subject
  useEffect(() => {
    if (selectedSubject && selectedSubject._id) {
      chapterService
        .getBySubject(selectedSubject._id)
        .then((res) => setChapters(res.data || []))
        .catch((err) => console.error("Lỗi khi lấy chương:", err));
    } else {
      setChapters([]);
    }
  }, [selectedSubject]);

  // Upload CSV
  const handleFileUpload = async () => {
    if (!selectedFile || !selectedSubject) {
      setUploadStatus("⚠️ Vui lòng chọn môn học (hoặc 'Khác') và file CSV!");
      return;
    }

    if (selectedSubject._id !== null && !selectedChapter) {
      setUploadStatus("⚠️ Vui lòng chọn chương cho môn đã chọn!");
      return;
    }

    if (!account || !account.accessToken) {
      setUploadStatus("⚠️ Bạn cần đăng nhập trước khi tải lên!");
      return;
    }
    if (!quizName.trim()) {
      setUploadStatus("⚠️ Vui lòng nhập tên bộ đề trước khi tải lên!");
      return;
    }

    if (contributionStats && contributionStats.remaining === 0) {
      setUploadStatus(
        "🚫 Bạn đã đạt giới hạn đóng góp đề trong 7 ngày gần nhất!"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", quizName);
    formData.append("subjectId", selectedSubject._id ?? "");
    formData.append("chapterId", selectedChapter?._id ?? "");
    formData.append("suggestedNote", suggestedNote);

    try {
      setUploadStatus("⏳ Đang tải lên...");
      await contributedService.uploadCSV(formData);
      setUploadStatus("✅ Tải lên thành công!");

      // refresh stats
      contributedService
        .getStats()
        .then((res) => setContributionStats(res.data))
        .catch(() => {});

      // reset
      setSelectedFile(null);
      setSelectedSubject(null);
      setSelectedChapter(null);
      setSuggestedNote("");
      setQuizName("");
      const fileEl = document.getElementById("fileInput");
      if (fileEl) fileEl.value = "";
    } catch (err) {
      console.error("❌ Upload CSV error:", err);
      setUploadStatus(
        err.response?.data?.message ||
          "❌ Lỗi khi tải lên. Vui lòng thử lại sau!"
      );
    }
  };

  const getStatusColorClass = () => {
    if (uploadStatus.includes("✅")) return "text-green-700";
    if (
      uploadStatus.includes("❌") ||
      uploadStatus.includes("⚠️") ||
      uploadStatus.includes("🚫")
    )
      return "text-red-600";
    if (uploadStatus.includes("⏳")) return "text-orange-500";
    return "";
  };

  return (
    <div className="w-[95%] mx-auto py-4 sm:py-6 flex flex-col gap-8">
      {/* Intro */}
      <div className="bg-white rounded-xl shadow-lg shadow-gray-200 p-8 text-center">
        <h1 className="text-4xl font-extrabold text-green-700">
          Đóng Góp Đề Trắc Nghiệm
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Hãy cùng đóng góp những bộ câu hỏi chất lượng để cộng đồng cùng học
          tốt hơn! Bạn có thể tải lên file CSV chứa đề. Tất cả đề gửi lên sẽ
          được kiểm duyệt trước khi xuất bản chính thức.
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg shadow-gray-200 p-8 min-h-[400px]">
        {account.role === "Admin" && mode === "edit" ? (
          <ContributedQuizList />
        ) : (
          <div className="flex flex-col gap-4">
            {/* Subject dropdown */}
            <div ref={subjectRef}>
              <div className="flex items-center gap-4 flex-col sm:flex-row">
                <p className="w-full sm:w-1/4 font-semibold text-lg text-green-700">
                  Chọn môn học:
                </p>
                <div className="flex items-center w-full sm:w-3/4 relative">
                  <input
                    type="text"
                    readOnly
                    value={
                      selectedSubject && selectedSubject._id !== null
                        ? selectedSubject.name
                        : selectedSubject && selectedSubject._id === null
                        ? "Khác"
                        : ""
                    }
                    placeholder="Chọn môn học..."
                    onClick={() => setExpandSubject((prev) => !prev)}
                    className="w-full py-2.5 px-4 rounded-lg border border-gray-300 text-base bg-gray-50"
                  />
                  <ExpandButton
                    className={`absolute right-2.5 text-3xl text-green-700 cursor-pointer transition-transform duration-300 ${
                      expandSubject ? "rotate-180" : ""
                    }`}
                    onClick={() => setExpandSubject((prev) => !prev)}
                  />
                </div>
              </div>

              <div
                className={`overflow-y-auto bg-gray-100 rounded-lg transition-[max-height] duration-300 ease-in-out shadow-md ${
                  expandSubject ? "max-h-[200px]" : "max-h-0"
                }`}
              >
                {subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="py-3 px-4 text-base bg-white m-1.5 rounded-lg cursor-pointer hover:bg-green-400 hover:text-white transition-all duration-200"
                    onClick={() => {
                      setSelectedSubject(subject);
                      setExpandSubject(false);
                      setSelectedChapter(null);
                      setSuggestedNote("");
                    }}
                  >
                    {subject.name}
                  </div>
                ))}

                <div
                  key="other-subject"
                  className="py-3 px-4 text-base bg-white m-1.5 rounded-lg cursor-pointer hover:bg-green-400 hover:text-white transition-all duration-200"
                  onClick={() => {
                    setSelectedSubject({ _id: null, name: "Khác" });
                    setExpandSubject(false);
                    setSelectedChapter(null);
                    setChapters([]);
                    setSuggestedNote("");
                  }}
                >
                  Khác
                </div>
              </div>
            </div>

            {/* Chapter dropdown */}
            {selectedSubject && selectedSubject._id !== null && (
              <div className="mt-3" ref={chapterRef}>
                <div className="flex items-center gap-4 flex-col sm:flex-row">
                  <p className="w-full sm:w-1/4 font-semibold text-lg text-green-700">
                    Chọn chương:
                  </p>
                  <div className="flex items-center w-full sm:w-3/4 relative">
                    <input
                      type="text"
                      readOnly
                      value={selectedChapter ? selectedChapter.name : ""}
                      placeholder="Chọn chương..."
                      onClick={() => setExpandChapter((prev) => !prev)}
                      className="w-full py-2.5 px-4 rounded-lg border border-gray-300 text-base bg-gray-50"
                    />
                    <ExpandButton
                      className={`absolute right-2.5 text-3xl text-green-700 cursor-pointer transition-transform duration-300 ${
                        expandChapter ? "rotate-180" : ""
                      }`}
                      onClick={() => setExpandChapter((prev) => !prev)}
                    />
                  </div>
                </div>

                <div
                  className={`overflow-y-auto bg-gray-100 rounded-lg transition-[max-height] duration-300 ease-in-out shadow-md ${
                    expandChapter ? "max-h-[200px]" : "max-h-0"
                  }`}
                >
                  {chapters.map((chapter) => (
                    <div
                      key={chapter._id}
                      className="py-3 px-4 text-base bg-white m-1.5 rounded-lg cursor-pointer hover:bg-green-400 hover:text-white transition-all duration-200"
                      onClick={() => {
                        setSelectedChapter(chapter);
                        setExpandChapter(false);
                      }}
                    >
                      {chapter.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz name input */}
            <div className="mt-3 mb-3 flex flex-col gap-2">
              <p className="font-semibold text-lg text-green-700">Tên bộ đề:</p>
              <input
                type="text"
                placeholder="Nhập tên bộ đề (VD: Đề ôn thi Giữa kỳ Toán 12)..."
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg text-base outline-none focus:border-green-700 focus:shadow-[0_0_4px_rgba(34,197,94,0.3)]"
              />
            </div>

            {/* If "Khác" selected show suggestion textarea */}
            {selectedSubject && selectedSubject._id === null && (
              <div className="mt-3 flex flex-col gap-2">
                <p className="text-green-700 font-semibold">
                  Bạn đã chọn <strong>Khác</strong> — vui lòng nhập tên môn học
                  và các chương bạn muốn gợi ý:
                </p>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Môn Lập trình Python – các chương: Cơ bản, OOP, Xử lý File..."
                  value={suggestedNote}
                  onChange={(e) => setSuggestedNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-y text-[15px] leading-relaxed outline-none focus:border-green-700 focus:shadow-[0_0_4px_rgba(34,197,94,0.25)]"
                />
                <p className="text-sm text-gray-600 mt-1 italic">
                  Gợi ý này sẽ được gửi cùng file CSV để admin xem xét và tạo
                  môn học mới.
                </p>
              </div>
            )}

            {/* Upload box */}
            <div className="mt-6 bg-gray-50 border-2 border-dashed border-green-400 rounded-xl p-8 text-center text-gray-700 text-lg">
              <p className="mb-4">
                {selectedSubject && selectedChapter
                  ? `📘 Bạn đang đóng góp đề cho chương "${selectedChapter.name}" thuộc môn "${selectedSubject.name}".`
                  : selectedSubject && selectedSubject._id === null
                  ? "📦 Bạn đang đóng góp đề và gợi ý môn học mới."
                  : "Vui lòng chọn môn học (hoặc 'Khác') và file CSV để bắt đầu đóng góp đề."}
              </p>

              {contributionStats && isAuthenticated && (
                <div className="mb-3 bg-blue-50 p-3.5 rounded-lg border-l-4 border-blue-500 text-base leading-relaxed">
                  <p>
                    📊 Bạn đã đóng góp{" "}
                    <strong>
                      {contributionStats.used}/{contributionStats.limit}
                    </strong>{" "}
                    đề trong 7 ngày gần nhất.
                  </p>
                  {contributionStats.remaining === 0 ? (
                    <p className="text-red-500 font-semibold mt-1">
                      🚫 Bạn đã đạt giới hạn {contributionStats.limit} đề! Hãy
                      thử lại sau vài ngày nhé.
                    </p>
                  ) : (
                    <p className="text-green-600 mt-1">
                      ✅ Bạn còn có thể gửi thêm{" "}
                      <strong>{contributionStats.remaining}</strong> đề.
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col items-center gap-3 mt-4">
                <input
                  id="fileInput"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="bg-gray-100 border border-gray-300 rounded-lg p-2 cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-base text-green-700 font-medium">
                    📄 {selectedFile.name}
                  </p>
                )}
                <button
                  className="bg-green-700 text-white border-none rounded-lg py-3 px-5 text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleFileUpload}
                  disabled={contributionStats?.remaining === 0}
                >
                  Tải Lên CSV
                </button>
              </div>

              {uploadStatus && (
                <p
                  className={`mt-4 font-semibold text-center ${getStatusColorClass()}`}
                >
                  {uploadStatus}
                </p>
              )}
            </div>

            {/* Guide */}
            <div className="bg-white rounded-xl shadow-lg shadow-gray-200 p-8 leading-relaxed text-gray-700 mt-6">
              <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">
                📘 Hướng Dẫn Chuyển Đổi File Sang CSV
              </h2>
              <p className="text-center text-lg text-gray-600 mb-6">
                Nếu bạn có bộ câu hỏi ở dạng{" "}
                <strong>PDF, Word, Excel hoặc TXT</strong>, bạn có thể dễ dàng
                chuyển sang định dạng CSV chuẩn trước khi tải lên.
              </p>

              <ul className="list-none p-0 mb-6 flex flex-col gap-3">
                <li className="bg-gray-50 border-l-4 border-green-400 p-3 sm:px-4 rounded-lg transition-colors hover:bg-gray-100">
                  <strong>1️⃣ PDF → CSV:</strong> Dùng phần mềm như{" "}
                  <em>SmallPDF</em> hoặc <em>iLovePDF</em> để xuất nội dung sang
                  Word, sau đó copy vào Excel rồi lưu dưới dạng CSV.
                </li>
                <li className="bg-gray-50 border-l-4 border-green-400 p-3 sm:px-4 rounded-lg transition-colors hover:bg-gray-100">
                  <strong>2️⃣ Word (.docx) → CSV:</strong> Mở file Word, copy
                  bảng câu hỏi vào Excel, đảm bảo mỗi cột tương ứng với:{" "}
                  <em>
                    {" "}
                    Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án
                    đúng | Giải thích
                  </em>
                  . Sau đó{" "}
                  <strong>Lưu dưới dạng → CSV (Comma delimited)</strong>.
                </li>
                <li className="bg-gray-50 border-l-4 border-green-400 p-3 sm:px-4 rounded-lg transition-colors hover:bg-gray-100">
                  <strong>3️⃣ Excel (.xlsx) → CSV:</strong> Mở file trong Excel,
                  chọn <strong>File → Save As → CSV (Comma delimited)</strong>.
                </li>
                <li className="bg-gray-50 border-l-4 border-green-400 p-3 sm:px-4 rounded-lg transition-colors hover:bg-gray-100">
                  <strong>4️⃣ TXT → CSV:</strong> Mở bằng Excel hoặc Google
                  Sheets, dùng tính năng “Text to Columns” để tách các phần câu
                  hỏi, rồi lưu lại thành CSV.
                </li>
              </ul>

              <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 sm:p-5 my-6">
                <p className="text-lg font-bold text-green-700 mb-2">
                  📄 Ví dụ mẫu file CSV chuẩn:
                </p>
                <pre className="bg-gray-100 rounded-lg p-4 font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap overflow-x-auto">
                  {`question,option1,option2,option3,option4,answer,explain
Thủ đô của Việt Nam là gì?,Hồ Chí Minh,Hà Nội,Đà Nẵng,Hải Phòng,Hà Nội,Hà Nội là thủ đô của Việt Nam.`}
                </pre>
                <p className="mt-1.5 text-sm text-gray-600 italic">
                  👉 Mỗi dòng là một câu hỏi, các cột được phân tách bằng dấu
                  phẩy (,).
                </p>
              </div>

              <p className="bg-gray-50 border border-dashed border-green-400 rounded-lg p-4 font-medium text-green-700 text-center">
                ⚙️ <strong>Lưu ý:</strong> Mỗi dòng trong file CSV nên đại diện
                cho <em>một câu hỏi</em>. Hãy đảm bảo không có dấu phẩy không
                cần thiết trong các ô dữ liệu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
