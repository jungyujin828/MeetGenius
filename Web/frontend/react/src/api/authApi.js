import axiosInstance from "./axiosInstance"; // Axios 인스턴스 가져오기

// ✅ 로그인 요청 (토큰 기반 인증)
export const loginRequest = async (employeeNumber, password) => {
  try {
    // 로그인 요청을 보낼 때 CSRF 토큰을 자동으로 헤더에 포함하도록 처리
    const response = await axiosInstance.post("/accounts/login/", {
      employee_number: employeeNumber,
      password,
      withCredentials: true, // 쿠키를 포함하여 요청 보냄
    });

    // 서버 응답에 CSRF 토큰이 포함되어 있을 경우 로컬 스토리지에 저장
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      localStorage.setItem("csrfToken", csrfToken);
    }

    // 인증 토큰을 로컬 스토리지에 저장
    const authToken = response.data.authToken; // 예시, 실제 응답 형식에 맞게 수정
    localStorage.setItem("authToken", authToken);

    return response.data; // 로그인 성공 시 반환되는 데이터
  } catch (error) {
    throw error.response?.data || "Login failed"; // 에러 처리
  }
};

// ✅ 로그아웃 요청 (토큰 기반)
export const logoutRequest = async () => {
  try {
    const authToken = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰 가져오기

    // 토큰이 없다면 로그아웃할 수 없음
    if (!authToken) {
      throw new Error("No valid auth token found");
    }

    // 로그아웃 요청을 보냄 (Authorization 헤더에 토큰 포함)
    await axiosInstance.post("/accounts/logout/", {}, {
      headers: {
        "Authorization": `Token ${authToken}`,
      },
    });

    // 로그아웃 후, 로컬 스토리지에서 토큰 삭제
    localStorage.removeItem("authToken");
    localStorage.removeItem("csrfToken"); // CSRF 토큰도 삭제
    return; // 성공 시 아무것도 반환하지 않음
  } catch (error) {
    console.error("로그아웃 오류:", error);
    throw error.response?.data || "로그아웃 실패"; // 에러 처리
  }
};

// ✅ 로그인된 사용자 정보 가져오기 (토큰 인증)
export const loadUserRequest = async () => {
  try {
    const authToken = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰 가져오기

    // 토큰이 없다면 사용자 정보를 가져올 수 없음
    if (!authToken) {
      throw new Error("No valid auth token found");
    }

    // 사용자 정보 요청 (Authorization 헤더에 토큰 포함)
    const response = await axiosInstance.get("/accounts/user/", {
      headers: {
        "Authorization": `Token ${authToken}`,
      },
    });
    return response.data; // 로그인된 사용자 정보 반환
  } catch (error) {
    throw error.response?.data || "Failed to load user"; // 에러 처리
  }
};

// 쿠키에서 CSRF 토큰을 가져오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
