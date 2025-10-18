import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./ContributedQuizPage.module.css";
import axios from "axios";
import { MdExpandMore as ExpandButton } from "react-icons/md";
import ContributedQuizList from "../../components/ContributedQuizList/ContributedQuizList";

export default function ContributedQuizPage() {
  const { account } = useSelector((state) => state.user);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [expandSubject, setExpandSubject] = useState(false);
  const [expandChapter, setExpandChapter] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // ref bọc cả input + list để click vào item được coi là "inside"
  const subjectRef = useRef(null);
  const chapterRef = useRef(null);

  // Tự đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectRef.current && !subjectRef.current.contains(event.target)) {
        setExpandSubject(false);
      }
      if (chapterRef.current && !chapterRef.current.contains(event.target)) {
        setExpandChapter(false);
      }
    };
    // dùng 'click' để onClick của item chạy trước khi handler đóng dropdown
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Lấy danh sách môn học
  useEffect(() => {
    axios
      .get("/api/subjects")
      .then((res) => setSubjects(res.data || []))
      .catch((err) => console.error("Lỗi khi lấy danh sách môn học:", err));
  }, []);

  // Lấy danh sách chương khi chọn môn (chỉ khi có _id thực)
  useEffect(() => {
    if (selectedSubject && selectedSubject._id) {
      axios
        .get(`/api/chapters/subject/${selectedSubject._id}`)
        .then((res) => setChapters(res.data || []))
        .catch((err) => console.error("Lỗi khi lấy chương:", err));
    } else {
      setChapters([]);
    }
  }, [selectedSubject]);

  // Upload file CSV
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

    const formData = new FormData();
    formData.append("file", selectedFile);
    // nếu là "Khác" thì _id sẽ null -> gửi "" (backend sẽ map "" => null)
    formData.append("subjectId", selectedSubject._id ?? "");
    formData.append("chapterId", selectedChapter?._id ?? "");

    try {
      setUploadStatus("⏳ Đang tải lên...");
      const res = await axios.post("/api/contributed/uploadCSV", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${account.accessToken}`,
        },
      });
      setUploadStatus("✅ Tải lên thành công!");
      console.log("Upload thành công:", res.data);

      // Reset form
      setSelectedFile(null);
      setSelectedSubject(null);
      setSelectedChapter(null);
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

  return (
    <div className={styles.container}>
      <div className={styles.introBox}>
        <h1 className={styles.title}>Đóng Góp Đề Trắc Nghiệm</h1>
        <p className={styles.description}>
          Hãy cùng đóng góp những bộ câu hỏi chất lượng để cộng đồng cùng học
          tốt hơn! Bạn có thể tải lên file CSV chứa đề, hoặc tạo đề trực tiếp
          trên hệ thống. Tất cả đề gửi lên sẽ được kiểm duyệt trước khi xuất bản
          chính thức.
        </p>
      </div>

      <div className={styles.contentBox}>
        {account.role === "Admin" ? (
          <ContributedQuizList />
        ) : (
          <div className={styles.formArea}>
            {/* Subject: ref bọc cả input + list */}
            <div ref={subjectRef}>
              <div className={styles.dropdownRow}>
                <p className={styles.label}>Chọn môn học:</p>
                <div className={styles.dropdownContainer}>
                  <input
                    type="text"
                    className={styles.dropdownInput}
                    readOnly
                    value={
                      selectedSubject && selectedSubject._id !== null
                        ? selectedSubject.name
                        : ""
                    }
                    placeholder="Chọn môn học..."
                  />
                  <ExpandButton
                    className={`${styles.expandButton} ${
                      expandSubject ? styles.rotate : ""
                    }`}
                    onClick={() => setExpandSubject((prev) => !prev)}
                  />
                </div>
              </div>

              <div
                className={`${styles.dropdownList} ${
                  expandSubject ? styles.showList : ""
                }`}
              >
                {subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setExpandSubject(false);
                      setSelectedChapter(null);
                    }}
                  >
                    {subject.name}
                  </div>
                ))}

                {/* Option "Khác" */}
                <div
                  key="other-subject"
                  className={styles.dropdownItem}
                  onClick={() => {
                    // set object with _id null — input sẽ hiển thị placeholder
                    setSelectedSubject({ _id: null, name: "Khác" });
                    setExpandSubject(false);
                    setSelectedChapter(null);
                    setChapters([]); // reset chapters list
                  }}
                >
                  Khác
                </div>
              </div>
            </div>

            {/* Chapter: ref bọc cả input + list */}
            <div style={{ marginTop: 12 }} ref={chapterRef}>
              {selectedSubject && selectedSubject._id !== null && (
                <>
                  <div className={styles.dropdownRow}>
                    <p className={styles.label}>Chọn chương:</p>
                    <div className={styles.dropdownContainer}>
                      <input
                        type="text"
                        className={styles.dropdownInput}
                        readOnly
                        value={
                          selectedChapter && selectedChapter._id !== null
                            ? selectedChapter.name
                            : ""
                        }
                        placeholder="Chọn chương..."
                      />
                      <ExpandButton
                        className={`${styles.expandButton} ${
                          expandChapter ? styles.rotate : ""
                        }`}
                        onClick={() => setExpandChapter((prev) => !prev)}
                      />
                    </div>
                  </div>

                  <div
                    className={`${styles.dropdownList} ${
                      expandChapter ? styles.showList : ""
                    }`}
                  >
                    {chapters.map((chapter) => (
                      <div
                        key={chapter._id}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setSelectedChapter(chapter);
                          setExpandChapter(false);
                        }}
                      >
                        {chapter.name}
                      </div>
                    ))}

                    <div
                      key="other-chapter"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setSelectedChapter({ _id: null, name: "Khác" });
                        setExpandChapter(false);
                      }}
                    >
                      Khác
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Nếu chọn "Khác" */}
            {selectedSubject && selectedSubject._id === null && (
              <p style={{ color: "#3d763a", fontWeight: 600, marginTop: 10 }}>
                Bạn đã chọn <strong>Khác</strong> — bạn có thể tải lên đề mà
                không cần chọn chương. Admin sẽ phân loại sau khi kiểm duyệt.
              </p>
            )}

            {/* Upload box */}
            <div className={styles.addQuizBox} style={{ marginTop: 16 }}>
              <p className={styles.infoText}>
                {selectedSubject && selectedChapter
                  ? `📘 Bạn đang đóng góp đề cho chương "${selectedChapter.name}" thuộc môn "${selectedSubject.name}".`
                  : selectedSubject && selectedSubject._id === null
                  ? "📦 Bạn đang đóng góp đề nhưng chọn 'Khác' cho môn — admin sẽ phân loại sau."
                  : "Vui lòng chọn môn học (hoặc 'Khác') và file CSV để bắt đầu đóng góp đề."}
              </p>

              <div className={styles.uploadSection}>
                <input
                  id="fileInput"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className={styles.fileInput}
                />
                {selectedFile && (
                  <p className={styles.fileName}>📄 {selectedFile.name}</p>
                )}
                <button
                  className={styles.uploadButton}
                  onClick={handleFileUpload}
                >
                  Tải Lên CSV
                </button>
              </div>

              {uploadStatus && (
                <p
                  className={`${styles.uploadStatus} ${
                    uploadStatus.includes("✅")
                      ? styles.success
                      : uploadStatus.includes("❌") ||
                        uploadStatus.includes("⚠️")
                      ? styles.error
                      : styles.loading
                  }`}
                >
                  {uploadStatus}
                </p>
              )}
            </div>
            {/* Sau này t nghĩ sẽ gắn thêm link đến trang mà nó hướng dẫn hoặc mình làm tài liệu*/}
            <div className={styles.guideBox}>
              <h2 className={styles.guideTitle}>
                📘 Hướng Dẫn Chuyển Đổi File Sang CSV
              </h2>
              <p className={styles.guideDesc}>
                Nếu bạn có bộ câu hỏi ở dạng{" "}
                <strong>PDF, Word, Excel hoặc TXT</strong>, bạn có thể dễ dàng
                chuyển sang định dạng CSV chuẩn trước khi tải lên.
              </p>

              <ul className={styles.guideList}>
                <li>
                  <strong>1️⃣ PDF → CSV:</strong> Dùng phần mềm như{" "}
                  <em>SmallPDF</em> hoặc <em>iLovePDF</em> để xuất nội dung sang
                  Word, sau đó copy vào Excel rồi lưu dưới dạng CSV.
                </li>
                <li>
                  <strong>2️⃣ Word (.docx) → CSV:</strong> Mở file Word, copy
                  bảng câu hỏi vào Excel, đảm bảo mỗi cột tương ứng với:
                  <em>
                    {" "}
                    Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án
                    đúng | Giải thích
                  </em>
                  . Sau đó{" "}
                  <strong>Lưu dưới dạng → CSV (Comma delimited)</strong>.
                </li>
                <li>
                  <strong>3️⃣ Excel (.xlsx) → CSV:</strong> Chỉ cần mở file trong
                  Excel, chọn{" "}
                  <strong>File → Save As → CSV (Comma delimited)</strong>.
                </li>
                <li>
                  <strong>4️⃣ TXT → CSV:</strong> Mở bằng Excel hoặc Google
                  Sheets, dùng tính năng “Text to Columns” để tách các phần câu
                  hỏi, rồi lưu lại thành CSV.
                </li>
              </ul>
              <div className={styles.exampleBox}>
                <p className={styles.exampleTitle}>
                  📄 Ví dụ mẫu file CSV chuẩn:
                </p>
                <pre className={styles.exampleCode}>
                  {`question,option1,option2,option3,option4,answer,explain
Thủ đô của Việt Nam là gì?,Hồ Chí Minh,Hà Nội,Đà Nẵng,Hải Phòng,Hà Nội,Hà Nội là thủ đô của Việt Nam.`}
                </pre>
                <p className={styles.exampleNote}>
                  👉 Mỗi dòng là một câu hỏi, các cột được phân tách bằng dấu
                  phẩy (,).
                </p>
              </div>
              <p className={styles.guideNote}>
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
