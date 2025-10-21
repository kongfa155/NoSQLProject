import api from "../api/axiosInstance";

const contributedService = {
  uploadCSV: (formData) =>
    api.post("/contributes/uploadCSV", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  approve: (id) => api.put(`/contributes/approve/${id}`),
  reject: (id) => api.put(`/contributes/reject/${id}`),
  getAll: () => api.get("/contributes"),
  getPaginated: (params) => api.get("/contributes/paginated", { params }),
  getStats: () => api.get("/contributes/stats"),
  getDetail: (id) => api.get(`/contributes/${id}`),
};

export default contributedService;
