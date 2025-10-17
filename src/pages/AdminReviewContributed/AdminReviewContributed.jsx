import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./AdminReviewContributed.module.css";

const AdminReviewContributed = () => {
  const { id } = useParams();
  const { account } = useSelector((state) => state.user);
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  // 🟢 Lấy đề đóng góp
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/contributed/${id}`,
          {
            headers: { Authorization: `Bearer ${account.accessToken}` },
          }
        );
        setQuiz(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải đề:", err);
      }
    };
    fetchQuiz();
  }, [id, account]);

  // 🟢 Duyệt
  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/contributed/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${account.accessToken}` } }
      );
      alert("✅ Đã duyệt đề!");
      navigate("/donggopde");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi duyệt!");
    }
  };

  // 🟢 Từ chối
  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/contributed/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${account.accessToken}` } }
      );
      alert("❌ Đã từ chối đề!");
      navigate("/donggopde");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi từ chối!");
    }
  };

  if (!quiz) return <div>Đang tải đề...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.summaryCard}>
        <h2 className={styles.quizTitle}>📘 {quiz.name}</h2>
        <p>
          👤 Người đóng góp: <b>{quiz.author?.name || "Ẩn danh"}</b>
        </p>
        <p>
          🧩 Số câu hỏi: <b>{quiz.questions.length}</b>
        </p>
        <p>
          📅 Ngày gửi: {new Date(quiz.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </div>

      <div className={styles.scrollBox}>
        {quiz.questions.map((q, i) => (
          <div key={i} className={styles.questionBlock}>
            <p className={styles.questionText}>
              <b>
                {i + 1}. {q.question}
              </b>
            </p>

            {q.image && (
              <div className={styles.imageWrapper}>
                <img
                  src={
                    q.image.startsWith("http")
                      ? q.image
                      : `http://localhost:5000/${q.image}`
                  }
                  alt="Question"
                  className={styles.questionImage}
                />
              </div>
            )}

            <ul className={styles.optionList}>
              {q.options.map((opt, idx) => (
                <li
                  key={idx}
                  className={`${styles.optionItem} ${
                    opt === q.answer ? styles.correct : ""
                  }`}
                >
                  {opt} {opt === q.answer && "✅"}
                </li>
              ))}
            </ul>

            <div className={styles.explainBox}>
              <span className={styles.explainLabel}>💡 Giải thích:</span>
              <p className={styles.explainText}>{q.explain}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actionBox}>
        <button className={styles.approveBtn} onClick={handleApprove}>
          ✅ Duyệt
        </button>
        <button className={styles.rejectBtn} onClick={handleReject}>
          ❌ Từ chối
        </button>
      </div>
    </div>
  );
};

export default AdminReviewContributed;
