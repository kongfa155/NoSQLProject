import api from "../api/axiosInstance";

const chapterService = {
  getAll: () => api.get("/chapters"),
  getBySubject: (subjectId) => api.get(`/chapters/subject/${subjectId}`),
  create: (data) => api.post("/chapters", data),
  updateAvailability: (id, data) => api.put(`/chapters/${id}`, data),
};

export default chapterService;
