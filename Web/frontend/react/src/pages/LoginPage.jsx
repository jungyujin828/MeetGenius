import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice"; // 로그인 액션
import { useNavigate } from "react-router-dom";
import Login from "../components/Login"; // 로그인 UI 컴포넌트

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth || {}); // Redux 상태

  // 사용자에게 에러 메시지를 표시하기 위한 상태
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * ✅ 로그인 요청 처리 함수
   * - 사용자가 입력한 사번과 비밀번호를 `loginUser` 액션을 통해 Redux로 전달
   * - 로그인 성공 시 `localStorage`에 `authToken` 저장 후 `/dashboard`로 이동
   */
  const handleLogin = async (employee_number, password) => {
    try {
      const resultAction = await dispatch(
        loginUser({ employeeNumber: employee_number, password })
      );

      // Redux Thunk 결과 확인
      if (loginUser.fulfilled.match(resultAction)) {
        const authToken = resultAction.payload.token; // 응답에서 토큰 추출
        localStorage.setItem("authToken", authToken); // 🔹 토큰 저장
        console.log("✅ 로그인 성공! 저장된 토큰:", authToken); // 확인용 로그
        navigate("/dashboard"); // 로그인 성공 시 대시보드 이동
      } else {
        setErrorMessage("로그인에 실패했습니다. 사번과 비밀번호를 확인해주세요."); // 사용자에게 피드백
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Login
      onLogin={handleLogin}
      isLoading={isLoading}
      error={errorMessage || error} // 오류 메시지 전달
    />
  );
};

export default LoginPage;
