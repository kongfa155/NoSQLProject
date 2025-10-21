// src/utils/baseAxios.js
import axios from "axios";

const baseAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export default baseAxios;

//Thằng này dùng khi liên quan đến mấy cái API không cần đăng nhập vẫn xài được