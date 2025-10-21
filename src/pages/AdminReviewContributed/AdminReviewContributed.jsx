import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./AdminReviewContributed.module.css";
import contributedService from "../../services/contributedService";
const AdminReviewContributed = () => {
  const { id } = useParams();
  const { account } = useSelector((state) => state.user);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const headers = { Authorization: `Bearer ${account.accessToken}` };

  // 🟢 Hàm gọi API chung
  const handleAction = useCallback(
    async (action, successMsg, errorMsg) => {
      try {
        if (action === "approve") {
          await contributedService.approve(id);
        }
        if (action === "reject") {
          await contributedService.reject(id);
        }
        alert(successMsg);
        navigate("donggopde");
      } catch (err) {
        console.error(err);
        alert(errorMsg || "Đã xảy ra lỗi!");
      }
    },
    [id, navigate]
  );

  // 🟢 Lấy đề đóng góp
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await contributedService.getDetail(id);
        setQuiz(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải đề:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <div className={styles.loading}>⏳ Đang tải đề...</div>;
  if (!quiz)
    return <div className={styles.error}>Không tìm thấy đề đóng góp.</div>;

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
                  src={q.image.startsWith("http") ? q.image : `/${q.image}`}
                  alt={`Question ${i + 1}`}
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

            {q.explain && (
              <div className={styles.explainBox}>
                <span className={styles.explainLabel}>💡 Giải thích:</span>
                <p className={styles.explainText}>{q.explain}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.actionBox}>
        <button
          className={styles.approveBtn}
          onClick={() =>
            handleAction("approve", "✅ Đã duyệt đề!", "Lỗi khi duyệt!")
          }
        >
          ✅ Duyệt
        </button>
        <button
          className={styles.rejectBtn}
          onClick={() =>
            handleAction("reject", "❌ Đã từ chối đề!", "Lỗi khi từ chối!")
          }
        >
          ❌ Từ chối
        </button>
      </div>
    </div>
  );
};

export default AdminReviewContributed;
