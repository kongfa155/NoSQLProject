

// src/utils/baseAxios.js
import axios from "axios";

// 1. Tạo một instance axios cơ bản
const baseApi = axios.create({
  // Base URL của Backend API (giống với axiosInstance)
  baseURL: "http://localhost:5000/api",
  
  // Tùy chọn: Thêm headers mặc định nếu cần
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Export instance này. 
// LƯU Ý: KHÔNG thêm request hay response interceptor ở đây.
export default baseApi;