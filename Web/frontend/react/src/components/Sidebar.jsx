import React from "react";
import styled from "styled-components";
import { FaTachometerAlt, FaUser, FaEnvelope, FaProjectDiagram, FaDoorOpen, FaMoneyCheckAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import { useDispatch } from "react-redux"; // useDispatch 추가
import { logoutUser } from "../redux/authSlice"; // Redux logoutUser 액션 임포트

// ✅ 사이드바 스타일
const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #274c77; /* 네이비 컬러 */
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

// ✅ 로고 스타일
const Logo = styled.img`
  width: 150px;
  margin-bottom: 20px;
`;

// ✅ 메뉴 아이템 스타일
const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  gap: 10px; /* 아이콘과 텍스트 간격 추가 */

  &:hover {
    background-color: #1b3a57;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  gap: 10px;
  background: transparent;
  border: none;
  color: white;

  &:hover {
    background-color: #1b3a57;
  }
`;

const Sidebar = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const dispatch = useDispatch(); // useDispatch 훅 사용

  const handleLogout = () => {
    dispatch(logoutUser()); // Redux에서 로그아웃 처리
    localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 삭제
    navigate("/accounts/login"); // 로그인 페이지로 리디렉션
  };

  return (
    <SidebarContainer>
      <Logo src="/203ai_logo.png" alt="203ai Logo" />
      <MenuItem><FaTachometerAlt /> Dashboard</MenuItem>
      <MenuItem><FaUser /> My page</MenuItem>
      <MenuItem><FaEnvelope /> Mail</MenuItem>
      <MenuItem><FaProjectDiagram /> Project</MenuItem>
      <MenuItem><FaDoorOpen /> Meeting room</MenuItem>
      <MenuItem><FaMoneyCheckAlt /> Paycheck</MenuItem>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt /> 로그아웃
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
