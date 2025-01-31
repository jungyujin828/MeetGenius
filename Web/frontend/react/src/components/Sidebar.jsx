import React from "react";
import styled from "styled-components";
// ✅ FontAwesome에서 아이콘 가져오기
import { FaTachometerAlt, FaUser, FaEnvelope, FaProjectDiagram, FaDoorOpen, FaMoneyCheckAlt } from "react-icons/fa";
import logo from "/203ai_logo.png"; // 로고 이미지 가져오기

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

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo src={logo} alt="203ai Logo" />
      <MenuItem><FaTachometerAlt /> Dashboard</MenuItem>
      <MenuItem><FaUser /> My page</MenuItem>
      <MenuItem><FaEnvelope /> Mail</MenuItem>
      <MenuItem><FaProjectDiagram /> Project</MenuItem>
      <MenuItem><FaDoorOpen /> Meeting room</MenuItem>
      <MenuItem><FaMoneyCheckAlt /> Paycheck</MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar;
