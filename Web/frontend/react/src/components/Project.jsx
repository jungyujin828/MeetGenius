import React, { useState, useEffect } from "react";
import styled from "styled-components"; // styled-components import 추가
import ProjectCreateWidget from "./ProjectCreateWidget"; // 프로젝트 생성 위젯
import ProjectListWidget from "./ProjectListWidget"; // 프로젝트 목록 위젯
import axios from "axios"; // axios import

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
  const [projects, setProjects] = useState([]); // 프로젝트 목록 상태 관리
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);     // 에러 상태

  // 프로젝트 목록을 가져오는 함수
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/projects/", {
        withCredentials: true, // 쿠키 포함
      });
      setProjects(response.data); // API에서 가져온 프로젝트 목록을 상태에 저장
      setLoading(false); // 로딩 완료
    } catch (error) {
      setError("프로젝트 목록을 불러오는 데 실패했습니다.");
      setLoading(false); // 로딩 완료
      console.error("프로젝트 목록 불러오기 오류:", error);
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
        {/* 프로젝트 목록 위젯 */}
        <ProjectListWidget projects={projects} loading={loading} error={error} />
        {/* 프로젝트 생성 위젯 */}
        <ProjectCreateWidget fetchProjects={fetchProjects} />
      </div>
    </ProjectContainer>
  );
};

export default Project;
