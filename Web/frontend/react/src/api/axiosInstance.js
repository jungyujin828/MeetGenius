import axios from "axios";


// ✅ Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Django 백엔드 API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 추가 (모든 요청에 CSRF 토큰 및 인증 헤더 추가)
axiosInstance.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    config.headers["Authorization"] = `Token ${authToken}`;
  }
  return config;
});

export default axiosInstance;
