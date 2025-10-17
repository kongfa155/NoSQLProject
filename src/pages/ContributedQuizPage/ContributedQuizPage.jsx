import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    axios
      .get("/api/subjects")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách môn học:", err));
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      axios
        .get(`/api/chapters/subject/${selectedSubject._id}`)
        .then((res) => setChapters(res.data))
        .catch((err) => console.error("Lỗi khi lấy chương:", err));
    } else {
      setChapters([]);
    }
  }, [selectedSubject]);

  // ✅ Hàm upload file CSV
  // ✅ Hàm upload file CSV (đã chỉnh chuẩn)
  const handleFileUpload = async () => {
    if (!selectedFile || !selectedSubject || !selectedChapter) {
      alert("Vui lòng chọn môn học, chương và file CSV!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("subjectId", selectedSubject._id);
    formData.append("chapterId", selectedChapter._id);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/contributed/uploadCSV",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${account.accessToken}`, // ✅ thêm token từ redux
          },
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("❌ Upload CSV error:", err);
      if (err.response) {
        alert(`Lỗi: ${err.response.data.message}`);
      } else {
        alert("❌ Không thể kết nối đến server backend!");
      }
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
            {/* --- Dropdown chọn môn học --- */}
            <div className={styles.dropdownRow}>
              <p className={styles.label}>Chọn môn học:</p>
              <div className={styles.dropdownContainer}>
                <input
                  type="text"
                  className={styles.dropdownInput}
                  readOnly
                  value={selectedSubject ? selectedSubject.name : ""}
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
            </div>

            {/* --- Dropdown chọn chương --- */}
            {selectedSubject && (
              <>
                <div className={styles.dropdownRow}>
                  <p className={styles.label}>Chọn chương:</p>
                  <div className={styles.dropdownContainer}>
                    <input
                      type="text"
                      className={styles.dropdownInput}
                      readOnly
                      value={selectedChapter ? selectedChapter.name : ""}
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
                </div>
              </>
            )}

            {/* --- Box mô tả & upload file CSV --- */}
            <div className={styles.addQuizBox}>
              <p className={styles.infoText}>
                {selectedSubject && selectedChapter
                  ? `Bạn đang chuẩn bị đóng góp đề cho chương "${selectedChapter.name}" thuộc môn "${selectedSubject.name}".`
                  : "Vui lòng chọn môn học và chương để bắt đầu đóng góp đề."}
              </p>

              <div className={styles.uploadSection}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className={styles.fileInput}
                />
                <button
                  className={styles.uploadButton}
                  onClick={handleFileUpload}
                >
                  Tải Lên CSV
                </button>
              </div>

              {uploadStatus && (
                <p className={styles.uploadStatus}>{uploadStatus}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
