import api from "../api/axiosInstance";

const questionImageService = {
  getAll: () => api.get("/questionimages"),
  getById: (id) => api.get(`/questionimages/${id}`),
  create: (data) => api.post("/questionimages", data),
  delete: (id) => api.delete(`/questionimages/${id}`),
};

export default questionImageService;
