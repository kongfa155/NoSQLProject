import baseAxios from "../utils/baseAxios";

const authService = {
  login: (data) => baseAxios.post("/auth/login", data),
  register: (data) => baseAxios.post("/auth/register", data),
  refresh: (refreshToken) => baseAxios.post("/auth/refresh", { refreshToken }),
  verifyOTP: (data) => baseAxios.post("/auth/verify-otp", data),
  forgotPassword: (data) => baseAxios.post("/auth/forgot-password", data),
  verifyForgotOtp: (data) => baseAxios.post("/auth/verify-forgot-otp", data),
  resetPassword: (data) => baseAxios.post("/auth/reset-password", data),
  getProfile: () => baseAxios.get("/auth/me"),
};

export default authService;
