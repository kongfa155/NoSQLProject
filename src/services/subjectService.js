import api from "../api/axiosInstance";

const subjectService = {
  getAll: () => api.get("/subjects"),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post("/subjects", data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export default subjectService;
