import React from "react";
import styled from "styled-components";
import { FaSearch, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import { useDispatch } from "react-redux"; // useDispatch 추가
import { logoutUser } from "../redux/authSlice"; // Redux logoutUser 액션 임포트

// ✅ 네비게이션 바 스타일
const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
`;

// ✅ 검색창 스타일
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// ✅ 사용자 정보 스타일
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #0056b3;
  }
`;

const Navbar = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const dispatch = useDispatch(); // useDispatch 훅 사용

  const handleLogout = () => {
    dispatch(logoutUser()); // Redux에서 로그아웃 처리
    localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 삭제
    navigate("/accounts/login"); // 로그인 페이지로 리디렉션
  };

  return (
    <NavbarContainer>
      <SearchBar>
        <FaSearch />
        <input type="text" placeholder="Search..." />
      </SearchBar>
      <UserInfo>
        <FaBell />
        <span>마케팅팀</span>
        <span>정유진 님</span>
        <FaUserCircle />
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> 로그아웃
        </LogoutButton>
      </UserInfo>
    </NavbarContainer>
  );
};

export default Navbar;
