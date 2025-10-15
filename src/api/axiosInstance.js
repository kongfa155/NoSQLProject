//src/api/aixosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Thêm access token cho mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor => nếu nhận 401, thử refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  })
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return axios(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      try {
        // Cần sử dụng axios gốc để gọi refresh token (không bị interceptor lặp)
        const res = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        processQueue(null, newToken);
        // Gọi lại request gốc với token mới
        originalRequest.headers.Authorization = "Bearer " + newToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // nếu refresh fail → logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
