import api from "../api/axiosInstance";

const contributedService = {
  uploadCSV: (formData) =>
    api.post("/contributed/uploadCSV", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  approve: (id) => api.put(`/contributed/approve/${id}`),
  reject: (id) => api.put(`/contributed/reject/${id}`),
  getAll: () => api.get("/contributed"),
  getPaginated: (params) => api.get("/contributed/paginated", { params }),
  getStats: () => api.get("/contributed/stats"),
  getDetail: (id) => api.get(`/contributed/${id}`),
};

export default contributedService;
