import api from "../api/axiosInstance";

const submissionService = {
  getByUser: (userId) => api.get(`/submissions/${userId}`),
  getLatest: (quizId, userId) =>
    api.get(`/submissions/latest/${quizId}/${userId}`),
  getBest: (quizId, userId) => api.get(`/submissions/best/${quizId}/${userId}`),
  getBySubject: (userId, subjectId) =>
    api.get(`/submissions/subject/${userId}/${subjectId}`),
  createOrUpdate: (data) => api.post("/submissions", data),
};

export default submissionService;
