import React from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux 상태 변경을 위한 훅 가져오기
import { loginUser } from "../redux/authSlice"; // 로그인 비동기 액션 가져오기
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅 가져오기
import Login from "../components/Login"; // 로그인 UI 컴포넌트 가져오기

const LoginPage = () => {
  const dispatch = useDispatch(); // Redux 액션을 실행하기 위한 dispatch 함수 생성
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 생성

  // Redux 스토어에서 현재 로그인 상태, 로딩 상태, 에러 상태 가져오기
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  /**
   * ✅ 로그인 버튼 클릭 시 실행되는 함수
   * - 사용자가 입력한 사번과 비밀번호를 Redux Thunk `loginUser`에 전달하여 로그인 요청을 보냄
   * - 로그인 성공 시 `/dashboard` 페이지로 자동 이동
   */
  const handleLogin = async (employee_number, password) => {
    const resultAction = await dispatch(
      loginUser({ employeeNumber: employee_number, password })
    );

    // 로그인 성공 시 `/dashboard`로 이동
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  return (
    // 로그인 컴포넌트 렌더링 (isLoading, error 상태를 전달하여 UI 반영)
    <Login onLogin={handleLogin} isLoading={isLoading} error={error} />
  );
};

export default LoginPage;
