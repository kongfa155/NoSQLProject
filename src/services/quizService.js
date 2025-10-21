import api from "../api/axiosInstance";

const quizService = {
  getAll: () => api.get("/quizzes"),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (data) => api.post("/quizzes", data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  updateAvailability: (id, data) =>
    api.put(`/quizzes/${id}/availability`, data),
  updateFull: (id, data) => api.put(`/quizzes/${id}/full`, data),
  getByChapter: (id) => api.get(`/quizzes/chapter/${id}`),
  getBySubject: (subjectId) => api.get(`/quizzes/subject/${subjectId}`),
};

export default quizService;
