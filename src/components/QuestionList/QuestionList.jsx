import styles from "./QuestionList.module.css";

const QuestionList = ({ questions, onDelete }) => {
    //Nhận dữ liệu câu hỏi và hàm xóa câu hỏi từ cha
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Danh sách câu hỏi</h2>
      {/* Kiểm tra coi có câu hỏi không, có thì hiển thị không thì để là chưa có */}
      {questions.length === 0 ? (
        <p>Chưa có câu hỏi nào.</p>
      ) : (
        <ul className={styles.list}>
            {/* Render list các câu hỏi */}
          {questions.map((q) => (
            <li key={q._id} className={styles.item}>
              <p className={styles.question}>{q.question}</p>
              <ul className={styles.optionList}>
                {/* Lọc qua các opt và set class cho câu trả lời đúng, tạm thời là chỉ set dữ liệu để hiển thị ra màu khác thôi */}
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`${styles.option} ${
                      q.answer === opt ? styles.correct : ""
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              {/* Nút xử lý xóa, truyền id của câu hỏi */}
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete(q._id)}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionList;
