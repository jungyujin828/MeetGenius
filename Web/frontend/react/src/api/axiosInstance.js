import axios from "axios";

// ✅ 쿠키에서 CSRF 토큰을 가져오는 함수
function getCSRFToken() {
  let csrfToken = null;
  const cookies = document.cookie.split(";"); // 모든 쿠키 가져오기
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim(); // 앞뒤 공백 제거
    if (cookie.startsWith("csrftoken=")) {
      csrfToken = cookie.substring("csrftoken=".length, cookie.length); // CSRF 토큰 값 추출
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

// ✅ 요청 인터셉터 추가 (모든 요청에 CSRF 토큰 포함)
axiosInstance.interceptors.request.use((config) => {
  config.headers["X-CSRFToken"] = getCSRFToken(); // 매 요청마다 CSRF 토큰 갱신
  return config;
});

export default axiosInstance;
