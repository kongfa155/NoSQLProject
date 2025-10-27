import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Đổi 'base' thành '/' để chạy ở gốc tên miền riêng
  base: '/', 

  // Toàn bộ cấu hình server này CHỈ dành cho dev (localhost)
  // Nó không ảnh hưởng gì đến file build deploy lên GitHub
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});