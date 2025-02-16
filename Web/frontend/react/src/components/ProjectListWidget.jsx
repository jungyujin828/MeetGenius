import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ProjectCreateWidget from "./ProjectCreateWidget"; // 프로젝트 생성 위젯


const ProjectContainer = styled.div`
  margin: 20px;
  max-width: 600px;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ProjectItem = styled.li`
  margin: 20px;
  max-width: 500px;
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #274c77;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1b3a57;
  }
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const ProjectListWidget = ({ projects, loading, error, setSelectedProject }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  

  if (loading) {
    return <div>프로젝트 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedProjects = projects
    .sort((a, b) => new Date(a.duedate) - new Date(b.duedate))
    .slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  const handleNext = () => {
    if (currentPage < Math.ceil(projects.length / projectsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ProjectContainer>
      <h3>진행중인 프로젝트</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
      {sortedProjects.length === 0 ? (
          <li>진행 중인 프로젝트가 없습니다.</li>
        ) : (
          sortedProjects.map((project) => (
            <ProjectItem key={project.id}>
              <div>
                <strong>{project.name}</strong> - <em>마감일: {new Date(project.duedate).toLocaleDateString()}</em>
              </div>
              <div>참여자: {project.participants.map((participant) => participant.name).join(", ")}</div>
              <Button onClick={() => setSelectedProject(project.id)}>상세보기</Button>  {/* 상세보기 버튼 */}
            </ProjectItem>
          ))
        )}
      </ul>

      <Pagination>
        <Button onClick={handlePrevious} disabled={currentPage === 1}>
          이전
        </Button>
        <Button onClick={handleNext} disabled={currentPage === Math.ceil(projects.length / projectsPerPage)}>
          다음
        </Button>
      </Pagination>
    </ProjectContainer>
  );
};

export default ProjectListWidget;