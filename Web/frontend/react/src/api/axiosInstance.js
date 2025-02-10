import axios from "axios";

// ✅ 쿠키에서 CSRF 토큰을 가져오는 함수
function getCSRFToken() {
  let csrfToken = null;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("csrftoken=")) {
      csrfToken = cookie.substring("csrftoken=".length, cookie.length);
    }
  }
  return csrfToken;
}

// ✅ Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Django 백엔드 API URL
  withCredentials: true, // 쿠키 기반 인증 활성화
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": getCSRFToken(), // CSRF 토큰 자동 포함
  },
});

// ✅ 요청 인터셉터 추가 (모든 요청에 CSRF 토큰 및 인증 헤더 추가)
axiosInstance.interceptors.request.use((config) => {
  config.headers["X-CSRFToken"] = getCSRFToken(); // 매 요청마다 CSRF 토큰 갱신
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`; // JWT 토큰 추가
  }
  return config;
});

export default axiosInstance;
