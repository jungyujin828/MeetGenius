import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProjectCreateWidget from "./ProjectCreateWidget";
import ProjectListWidget from "./ProjectListWidget";
import ProjectMom from "./ProjectMom";
import { useDispatch, useSelector } from "react-redux";
import { setProjects } from "../redux/projectSlice";
import { fetchProjects } from "../api/project";
import ProjectDetail from "./ProjectDetail";

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 25px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`;

const ProjectSidePanel = styled.div`
  flex: 0 0 350px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Project = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.list); // 리덕스에서 프로젝트 목록 가져오기
  const [isCreateVisible, setIsCreateVisible] = useState(false); // 생성하기 위젯 보이기 여부
  const [selectedProject, setSelectedProject] = useState(null); // 선택된 프로젝트 ID
  const [selectedMeetingProject, setSelectedMeetingProject] = useState(null); // 선택된 회의 프로젝트 ID

  useEffect(() => {
    const getProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        dispatch(setProjects(projectsData)); // 리덕스에 프로젝트 목록 설정
      } catch (error) {
        console.error("프로젝트 목록 불러오기 오류:", error);
      }
    };

    getProjects(); // 프로젝트 목록 가져오기
  }, [dispatch]);

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId); // 선택된 프로젝트 ID 설정
    setIsCreateVisible(false); // 생성 위젯을 숨기기
    setSelectedMeetingProject(null); // 회의내역 숨기기
  };

  const handleMeetingDetailsSelect = (projectId) => {
    setSelectedMeetingProject(projectId); // 회의 프로젝트 ID 설정
    setSelectedProject(null); // 상세보기 숨기기
  };
  
  const closeProjectDetail = () => {
    setSelectedProject(null); // 프로젝트 상세보기 닫기
  };

  const handleCreateProjectToggle = () => {
    setIsCreateVisible((prev) => !prev); // 프로젝트 생성 폼 토글
    setSelectedProject(null); // 상세보기 숨기기
    setSelectedMeetingProject(null); // 회의내역 숨기기
  };

  return (
    <ProjectContainer>
      <h2>프로젝트 관리</h2>
      <ContentWrapper>
          <ProjectListWidget
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onMeetingDetailsSelect={handleMeetingDetailsSelect} // 전달된 회의내역 보기 함수
          />

        <ProjectSidePanel>
          <button
            onClick={handleCreateProjectToggle}
            style={{
              marginBottom: "20px",
              padding: "10px 20px",
              backgroundColor: "#274c77",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isCreateVisible ? "생성 취소하기" : "프로젝트 생성하기"}
          </button>

          {/* 생성하기 위젯이 보일 때 */}
          {isCreateVisible && <ProjectCreateWidget closeCreateProject={handleCreateProjectToggle} />}

          {/* 상세보기 위젯이 보일 때 */}
          {selectedProject && !isCreateVisible && (
            <ProjectDetail projectId={selectedProject} onClose={closeProjectDetail} />
          )}

          {/* 회의내역 보기 */}
          {selectedMeetingProject && !isCreateVisible && (
            <div>
              <ProjectMom projectId={selectedMeetingProject} />  {/* This will render "회의록보기" */}
              </div>
          )}
        </ProjectSidePanel>
      </ContentWrapper>
    </ProjectContainer>
  );
};

export default Project;
