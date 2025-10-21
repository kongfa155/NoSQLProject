// src/api/axiosInstance.js
import axios from "axios";
import baseAxios from "../utils/baseAxios";
import nProgress from "nprogress";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});
nProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    nProgress.start();
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    nProgress.done();
     return  response
},
  async (error) => {
    
    const originalRequest = error.config;

    // Nếu 401 và chưa retry → thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No refresh token, redirect to login");
        localStorage.clear();
        return Promise.reject(error);
      }

      try {
        // dùng baseAxios (không interceptor) để tránh vòng lặp
        const res = await baseAxios.post("/auth/refresh", { refreshToken });
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;



//Thằng này dùng khi xài mấy cái API cần đăng nhập