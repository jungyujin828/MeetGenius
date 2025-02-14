import axios from "axios";

const baseURL = import.meta.env.VITE_APP_BASEURL; // 서버의 기본 URL 설정

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // 쿠키를 포함하여 요청을 보냄
});

// 기본적으로 withCredentials 설정 (다른 도메인에서 쿠키를 포함시키기 위해)
axiosInstance.defaults.withCredentials = true;  // 쿠키를 포함하여 요청을 보냄

// 요청 인터셉터 추가 (모든 요청에 CSRF 토큰 및 인증 헤더 추가)
axiosInstance.interceptors.request.use((config) => {
  // 로컬 스토리지에서 인증 토큰을 가져옴
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    config.headers["Authorization"] = `Token ${authToken}`; // 인증 헤더에 토큰 추가
  }

  // 쿠키에서 CSRF 토큰을 가져옴
  const csrfToken = getCookie("csrftoken");  // 쿠키에서 CSRF 토큰 가져오기
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken; // CSRF 토큰을 헤더에 추가
  }

  return config;
});

// 쿠키에서 CSRF 토큰을 가져오는 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};


export default axiosInstance;
