import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ContributedQuizList.module.css";

export default function ContributedQuizList() {
  const { account } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Hàm sắp xếp theo status
  const sortItems = (items) => {
    const priority = { pending: 1, approved: 2, rejected: 3 };
    return [...items].sort((a, b) => priority[a.status] - priority[b.status]);
  };

  // ✅ Fetch danh sách đề
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/contributed", {
        headers: { Authorization: `Bearer ${account.accessToken}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setAllItems(sortItems(data)); // sort ngay khi fetch
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách đóng góp:", err);
      alert("Không thể tải danh sách đề đóng góp!");
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [account.accessToken]);



  if (loading)
    return <div className={styles.loading}>Đang tải danh sách...</div>;

  return (
    <div className={styles.wrapper}>
      <h2>Danh sách đề người dùng đóng góp</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên đề</th>
            <th>Người đóng góp</th>
            <th>Môn học</th>
            <th>Chương</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {allItems && allItems.length > 0 ? (
            allItems.map((quiz, idx) => (
              <tr
                key={quiz._id || idx}
                className={
                  quiz.status === "rejected" ? styles.rowRejected : undefined
                }
              >
                <td>{idx + 1}</td>
                <td>{quiz.title || "—"}</td>
                <td>{quiz.contributorId?.username || "Ẩn danh"}</td>
                <td>{quiz.subjectId?.name || "—"}</td>
                <td>{quiz.chapterId?.name || "—"}</td>
                <td
                  className={
                    quiz.status === "approved"
                      ? styles.approved
                      : quiz.status === "rejected"
                      ? styles.rejected
                      : styles.pending
                  }
                >
                  {quiz.status === "approved"
                    ? "Đã duyệt"
                    : quiz.status === "rejected"
                    ? "Bị từ chối"
                    : "Chờ duyệt"}
                </td>
                <td className={styles.actions}>
                  {quiz.status === "pending" ? (
                    <>
                      <button
                        className={styles.reviewButton}
                        onClick={() =>
                          navigate(`/review-contributed/${quiz._id}`)
                        }
                      >
                        Xem
                      </button>
                    
                    </>
                  ) : (
                    <span
                      className={`${styles.dimmedAction} ${
                        quiz.status === "rejected" ? styles.faded : ""
                      }`}
                    >
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
