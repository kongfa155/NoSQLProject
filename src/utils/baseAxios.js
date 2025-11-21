// src/utils/baseAxios.js

/**
 * Base Axios Instance
 * ----------------------
 * Dùng cho các API không yêu cầu authentication
 * Cấu hình baseURL từ environment variable hoặc fallback mặc định
 * Mặc định gửi header "Content-Type: application/json"
 *
 * Lưu ý:
 * - Không có interceptors tự động gắn accessToken
 * - Dùng cho những route public như: login, register, get subjects/quizzes
 */

import axios from "axios";

const baseAxios = axios.create({
  // URL cơ sở của API
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://nosqlproject-fp2f.onrender.com/api",

  // Header mặc định
  headers: { "Content-Type": "application/json" },
});

export default baseAxios;
