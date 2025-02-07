import React from "react";
import styled from "styled-components";
import { FaSearch, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Redux에서 사용자 정보 가져오기
import { logoutUser } from "../redux/authSlice";

// ✅ 네비게이션 바 스타일
const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 좌우에 배치 */
  position: fixed; /* 상단 고정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* 높이 조정 */
  background-color: white;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
  z-index: 1000;
`;

// ✅ 로고 스타일
const Logo = styled.img`
  width: 120px; /* 로고 크기 조정 */
  height: auto;
`;

// ✅ 오른쪽 섹션 스타일 (부서명, 이름, 검색창, 로그아웃 버튼을 모을 컨테이너)
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-right: 50px;
`;

// ✅ 검색창 스타일
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  input {
    width: 150px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
    color: #274C77;
`;

// ✅ 사용자 정보 스타일
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 16px;
  font-weight: bold; /* 글씨 굵게 */
  color: #274C77;
`;

// ✅ 이름 색상 변경 스타일
const Name = styled.span`
  color:#274C77; /* 이름에 색상 설정 */
`;

// ✅ 로그아웃 버튼 스타일
const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: #274C77;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold; /* 글씨 굵게 */

  &:hover {
    color: #0056b3;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Redux에서 로그인한 사용자 정보 가져오기
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    navigate("/accounts/login");
  };

  return (
    <NavbarContainer>
      {/* ✅ 네비게이션 바 왼쪽에 로고 추가 */}
      <Logo src="/203ai_logo.png" alt="203ai Logo" />

      {/* ✅ 오른쪽에 위치한 부서명, 이름, 로그아웃 버튼, 검색창 */}
      <RightSection>
        <SearchBar>
          <FaSearch />
          <input type="text" placeholder="Search..." />
        </SearchBar>

        <UserInfo>
          <FaBell />
          {user ? (
            <>
              <span>{user.department}팀</span> {/* 사용자 부서 */}
              <Name>{user.name}님</Name> {/* 사용자 이름, 색상 변경 */}
            </>
          ) : (
            <span>사용자 정보 없음</span>
          )}
          <FaUserCircle />
        </UserInfo>


        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> 로그아웃
        </LogoutButton>
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;
