import React, { useState, useEffect } from "react";
import styled from "styled-components"; // styled-components import 추가
import ProjectCreateWidget from "./ProjectCreateWidget";
import ProjectListWidget from "./ProjectListWidget";
import axios from "axios";

// 스타일 컴포넌트
const ProjectContainer = styled.div`
  margin-left: 250px; // 사이드바 너비 고려
  margin-top: 60px; // 네비게이션 바 높이 고려
  padding: 20px; // 적절한 패딩 제공
  width: calc(100vw - 250px); // 전체 너비에서 사이드바 너비 빼기
  height: calc(100vh - 60px); // 네비게이션 바 아래에서 시작하도록 높이 조정
  overflow: hidden; // 모든 방향의 스크롤 방지
  box-sizing: border-box; // 패딩과 보더가 너비와 높이 계산에 포함되도록 설정
`;

const Project = () => {
  const [projects, setProjects] = useState([]); // projects 상태 초기값을 빈 배열로 설정

  // 프로젝트 목록을 가져오는 함수
  const fetchProjects = async () => {
    try {
      const response = await axios.get("/accounts/projects/");
      setProjects(response.data); // API에서 가져온 프로젝트 목록을 상태에 저장
    } catch (error) {
      console.error("프로젝트 목록 조회 실패:", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 프로젝트 목록을 가져오는 효과
  useEffect(() => {
    fetchProjects(); // 페이지 로드 시 프로젝트 목록을 가져옴
  }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

  return (
    <ProjectContainer>
      <h2>프로젝트 관리</h2>
      <div style={{ display: "flex", gap: "20px", overflow: "auto", maxHeight: "calc(100% - 40px)" }}>
        <ProjectListWidget projects={projects} /> {/* props로 프로젝트 목록 전달 */}
        <ProjectCreateWidget fetchProjects={fetchProjects} /> {/* 프로젝트 생성 후 목록을 새로 고침 */}
      </div>
    </ProjectContainer>
  );
};

export default Project;
