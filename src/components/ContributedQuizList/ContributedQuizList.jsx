import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import styles from "./ContributedQuizList.module.css";

export default function ContributedQuizList() {
  const { account } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 5;

  // Fetch danh sách đề với pagination
  const fetchQuizzes = async (page = 1, isPageChange = false) => {
    if (isPageChange) setPageLoading(true);
    else setInitialLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/contributed/paginated?page=${page}&limit=${itemsPerPage}`,
        { headers: { Authorization: `Bearer ${account.accessToken}` } }
      );

      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setQuizzes(data);
      setPageCount(res.data.pageCount || 0);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách đóng góp:", err);
      alert("Không thể tải danh sách đề đóng góp!");
      setQuizzes([]);
    } finally {
      setInitialLoading(false);
      setPageLoading(false);
    }
  };

  // Chuyển trang
  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    fetchQuizzes(selectedPage, true);
  };

  useEffect(() => {
    fetchQuizzes(currentPage);
  }, [account.accessToken]);

  if (initialLoading)
    return <div className={styles.loading}>Đang tải danh sách...</div>;

  return (
    <div className={styles.wrapper}>
      {pageLoading && <div className={styles.overlay}>Đang tải trang...</div>}
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
          {quizzes.length > 0 ? (
            quizzes.map((quiz, idx) => (
              <tr
                key={quiz._id || idx}
                className={quiz.status === "rejected" ? styles.rowRejected : ""}
              >
                <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
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
                    <button
                      className={styles.reviewButton}
                      onClick={() =>
                        navigate(`/review-contributed/${quiz._id}`)
                      }
                    >
                      Xem
                    </button>
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

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <ReactPaginate
            // ... (các thuộc tính khác)
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            // CHỈNH SỬA TẠI ĐÂY: Sử dụng styles.className
            pageClassName={styles["page-item"]}
            pageLinkClassName={styles["page-link"]}
            previousClassName={styles["page-item"]} // Hoặc tạo class riêng nếu cần style khác
            previousLinkClassName={styles["page-link"]} // Hoặc tạo class riêng
            nextClassName={styles["page-item"]} // Hoặc tạo class riêng
            nextLinkClassName={styles["page-link"]} // Hoặc tạo class riêng
            breakClassName={styles["break-item"] || styles["page-item"]} // Nếu có break-item
            breakLinkClassName={styles.breakLink || styles["page-link"]} // Nếu có breakLink
            // Thuộc tính quan trọng nhất: containerClassName và activeClassName
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            // Lưu ý: Đối với các class như `previousClassName`, nếu bạn muốn sử dụng `page-item`
            // đã scoped, bạn cần dùng `styles['page-item']`.
            // Nếu bạn muốn tạo class riêng, bạn phải định nghĩa nó trong file CSS module.

            forcePage={currentPage - 1}
          />
        </div>
      )}
    </div>
  );
}
