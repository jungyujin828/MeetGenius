import React from "react";
import styled from "styled-components";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

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

const Navbar = () => {
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
      </UserInfo>
    </NavbarContainer>
  );
};

export default Navbar;
