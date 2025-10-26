import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import contributedService from "../../services/contributedService";

export default function ContributedQuizList() {
  const { account } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 5;

  const fetchQuizzes = async (page = 1, isPageChange = false) => {
    if (isPageChange) setPageLoading(true);
    else setInitialLoading(true);

    try {
      const res = await contributedService.getPaginated({
        page,
        limit: itemsPerPage,
      });

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

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    fetchQuizzes(selectedPage, true);
  };

  useEffect(() => {
    fetchQuizzes(currentPage);
  }, [account.accessToken]);

  if (initialLoading)
    return (
      <div className="text-center mt-10 text-lg text-green-700">
        Đang tải danh sách...
      </div>
    );

  return (
    <div className="relative w-[95%] mx-auto my-4 bg-white rounded-xl shadow-md p-8">
      {pageLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center font-medium text-green-700 z-10 rounded-lg">
          Đang tải trang...
        </div>
      )}

      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
        Danh sách đề người dùng đóng góp
      </h2>

      <table className="w-full border-collapse rounded-xl overflow-hidden bg-gray-50 shadow-sm">
        <thead>
          <tr className="bg-green-50 text-green-700 font-semibold">
            <th className="p-3 border-b border-gray-200">STT</th>
            <th className="p-3 border-b border-gray-200">Tên đề</th>
            <th className="p-3 border-b border-gray-200">Người đóng góp</th>
            <th className="p-3 border-b border-gray-200">Môn học</th>
            <th className="p-3 border-b border-gray-200">Chương</th>
            <th className="p-3 border-b border-gray-200">Ghi chú / Gợi ý</th>
            <th className="p-3 border-b border-gray-200">Trạng thái</th>
            <th className="p-3 border-b border-gray-200">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, idx) => (
              <tr
                key={quiz._id || idx}
                className={`text-center border-b border-gray-200 hover:bg-green-50 transition ${
                  quiz.status === "rejected" ? "opacity-60" : ""
                }`}
              >
                <td className="p-3">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="p-3">{quiz.name || "—"}</td>
                <td className="p-3">
                  {quiz.contributorId?.username || "Ẩn danh"}
                </td>
                <td className="p-3">
                  {quiz.subjectId
                    ? quiz.subjectId.name
                    : "Khác (chưa có trong hệ thống)"}
                </td>
                <td className="p-3">
                  {quiz.chapterId
                    ? quiz.chapterId.name
                    : quiz.subjectId
                    ? "—"
                    : "Chưa có chương"}
                </td>
                <td className="p-3">
                  {quiz.adminNote ? (
                    <div className="bg-green-50 text-gray-700 rounded-lg px-2 py-1 inline-block">
                      <span>{quiz.adminNote}</span>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td
                  className={`p-3 font-semibold ${
                    quiz.status === "approved"
                      ? "text-green-700"
                      : quiz.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {quiz.status === "approved"
                    ? "Đã duyệt"
                    : quiz.status === "rejected"
                    ? "Bị từ chối"
                    : "Chờ duyệt"}
                </td>
                <td className="p-3">
                  {quiz.status === "pending" ? (
                    <button
                      onClick={() =>
                        navigate(`/review-contributed/${quiz._id}`)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-1 transition font-medium"
                    >
                      Xem
                    </button>
                  ) : (
                    <span
                      className={`text-gray-400 ${
                        quiz.status === "rejected" ? "opacity-70" : ""
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
              <td colSpan={8} className="text-center py-6 text-gray-600">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pageCount > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            containerClassName="flex gap-2 list-none"
            pageClassName="inline-block"
            pageLinkClassName="block px-3 py-1 border border-green-200 rounded-lg bg-white text-green-700 hover:bg-green-500 hover:text-white transition"
            previousLinkClassName="block px-3 py-1 border border-green-200 rounded-lg bg-white text-green-700 hover:bg-green-500 hover:text-white transition font-semibold"
            nextLinkClassName="block px-3 py-1 border border-green-200 rounded-lg bg-white text-green-700 hover:bg-green-500 hover:text-white transition font-semibold"
            breakLinkClassName="block px-3 py-1 text-green-700"
            activeLinkClassName="bg-green-700 text-green border-green-700"
            disabledLinkClassName="text-gray-400 bg-gray-100 border-gray-200 pointer-events-none"
            forcePage={currentPage - 1}
          />
        </div>
      )}
    </div>
  );
}
