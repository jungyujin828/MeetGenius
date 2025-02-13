import React, { useState, useEffect } from "react";
import styled from "styled-components"; // styled-components import 추가
import ProjectCreateWidget from "./ProjectCreateWidget"; // 프로젝트 생성 위젯
import ProjectListWidget from "./ProjectListWidget"; // 프로젝트 목록 위젯
import ProjectDetail from "./ProjectDetail";  // 추가: 프로젝트 상세보기 컴포넌트
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
  const [selectedProject, setSelectedProject] = useState(null);  // 추가: 선택된 프로젝트
  const [showCreateProject, setShowCreateProject] = useState(false); // 프로젝트 생성 컴포넌트 보이기 여부 상태
  const closeCreateProject = () => {
    setShowCreateProject(false);  // 프로젝트 생성 컴포넌트 숨김
  };
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 상세보기 닫기 함수
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedProject(null); // 선택된 프로젝트도 초기화
  };
  

  // 프로젝트 목록을 가져오는 함수
  const fetchProjects = async () => {
    const authToken = localStorage.getItem("authToken"); // 로그인 후 저장된 토큰을 가져옵니다.
  
    if (!authToken) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get(BASEURL + "/projects/", {
        headers: {
          Authorization: `Token ${authToken}`, // 헤더에 토큰을 추가합니다.
        },
        withCredentials: true,  // 인증 쿠키가 필요한 경우 true로 설정합니다.
      });
      setProjects(response.data); // 프로젝트 목록을 상태에 저장
      setLoading(false); // 로딩 완료
    } catch (error) {
      setError("프로젝트 목록을 불러오는 데 실패했습니다.");
      setLoading(false);
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

      {/* 상세보기 창이 열리면 ProjectDetail 컴포넌트를 렌더링 */}
      {isDetailOpen && <ProjectDetail projectId={selectedProject} onClose={handleCloseDetail} />}

      {selectedProject ? (
        // 프로젝트 상세보기 페이지
        <ProjectDetail projectId={selectedProject} onClose={handleCloseDetail} />
      ) : (
        // 프로젝트 목록 페이지 및 생성 위젯
        <div style={{ display: "flex", gap: "20px", overflow: "auto", maxHeight: "calc(100% - 40px)" }}>
          <ProjectListWidget
            projects={projects}
            loading={loading}
            error={error}
            setSelectedProject={setSelectedProject}  // 상세보기 페이지로 전환
          />
          <div style={{ flex: 1 }}>
            {/* 프로젝트 생성 버튼 */}
            <button onClick={() => setShowCreateProject(true)} style={{ marginBottom: "20px", padding: "10px 20px", backgroundColor: "#274c77", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              프로젝트 생성하기
            </button>

            {/* showCreateProject가 true일 때만 ProjectCreateWidget을 렌더링 */}
            {showCreateProject && (
              <ProjectCreateWidget fetchProjects={fetchProjects} closeCreateProject={closeCreateProject} />
            )}
          </div>
        </div>
      )}
    </ProjectContainer>
  );
};

export default Project;