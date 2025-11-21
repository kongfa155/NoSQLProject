// src/api/axiosInstance.js

/**
 * Axios Instance dành cho các API yêu cầu đăng nhập
 * --------------------------------------------------
 * Tự động gắn accessToken vào request
 * Tự refresh token khi accessToken hết hạn
 * Queue các request trong lúc refresh để tránh spam refresh API
 * Sử dụng baseAxios (không interceptor) cho refresh → tránh lặp vô hạn
 * Hiển thị NProgress loading bar
 */

import axios from "axios";
import baseAxios from "../utils/baseAxios";
import nProgress from "nprogress";

// Tạo axios instance chính
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://nosqlproject-fp2f.onrender.com/api",

  // Luôn resolve promise, kể cả lỗi → tự xử lý trong interceptor
  validateStatus: () => true,
});

// Cấu hình thanh loading NProgress (Thanh load phía dưới địa chỉ trang)
nProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

// Biến trạng thái refresh token
let isRefreshing = false;

// Những request thất bại vì 401 sẽ chờ ở đây để xử lý sau
let failedQueue = [];

/**
 * Xử lý queue khi refresh token xong:
 * - token mới → resolve toàn bộ các request đang chờ
 * - lỗi → reject hết
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/**
 * REQUEST INTERCEPTOR
 * -----------------------
 * Gắn accessToken vào header mỗi request
 * Bật NProgress loading bar
 */
api.interceptors.request.use(
  (config) => {
    nProgress.start();

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * -----------------------
 * Tắt NProgress
 * Nếu 401 → tự động refresh token
 * Queue request để tránh gửi refresh token nhiều lần
 */
api.interceptors.response.use(
  (response) => {
    // Luôn tắt progress khi response về
    nProgress.done();
    return response;
  },

  // Xử lý lỗi
  async (error) => {
    const originalRequest = error.config;

    /**
     * Nếu 401 Unauthorized và request chưa retry → thử refresh token
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đã có refresh đang chạy → chờ token mới
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Gắn token mới vào request rồi gửi lại
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Đánh dấu đã retry
      originalRequest._retry = true;
      isRefreshing = true;

      // Lấy refresh token từ localStorage
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No refresh token, redirect to login");
        localStorage.clear();
        return Promise.reject(error);
      }

      try {
        /**
         * Gửi request refresh token
         * Dùng baseAxios (không interceptor)
         * → tránh bị interceptors của chính mình bắt lại 401 → loop vô hạn
         */
        const res = await baseAxios.post("/auth/refresh", { refreshToken });

        const newToken = res.data.accessToken;

        // Lưu token mới
        localStorage.setItem("accessToken", newToken);

        // Gắn token vào default header của Axios instance
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // Resolve toàn bộ request đang chờ
        processQueue(null, newToken);

        // Gửi lại request gốc
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh thất bại → reject toàn bộ queue
        processQueue(err, null);
        localStorage.clear(); // Xoá hết token → logout
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Không phải lỗi 401, hoặc đã retry → trả lỗi luôn
    return Promise.reject(error);
  }
);

export default api;

/**
 * File này được dùng cho những API yêu cầu authentication.
 * Những API công khai (không cần login) thì dùng baseAxios.
 */
