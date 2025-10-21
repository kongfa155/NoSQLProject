import api from "../api/axiosInstance";

const questionService = {
  getAll: () => api.get("/questions"),
  getById: (id) => api.get(`/questions/${id}`),
  getByQuiz: (quizId) => api.get(`/questions/quiz/${quizId}`),
  create: (data) => api.post("/questions", data),
  delete: (id) => api.delete(`/questions/${id}`),
};

export default questionService;
