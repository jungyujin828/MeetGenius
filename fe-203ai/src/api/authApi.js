import axiosInstance from "./axiosInstance";

// ✅ 로그인 요청 (세션 기반)
export const loginRequest = async (employeeNumber, password) => {
  try {
    const response = await axiosInstance.post("/accounts/login/", {
      employee_number: employeeNumber,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

// ✅ 로그아웃 요청
export const logoutRequest = async () => {
  await axiosInstance.post("/accounts/logout/");
};
