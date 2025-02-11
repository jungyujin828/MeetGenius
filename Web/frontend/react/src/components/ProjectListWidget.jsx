import React from "react";
import styled from "styled-components"; // styled-components import 추가

// 스타일 컴포넌트
const ProjectContainer = styled.div`
  margin: 20px;
`;

const ProjectItem = styled.li`
  padding: 10px;
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

const ProjectListWidget = ({ projects, loading, error }) => {
  // 로딩 중일 때 표시할 텍스트
  if (loading) {
    return <div>프로젝트 목록을 불러오는 중...</div>;
  }

  // 에러가 발생한 경우
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ProjectContainer>
      <h3>진행중인 프로젝트</h3>
      <ul>
        {projects.length === 0 ? (
          <li>진행 중인 프로젝트가 없습니다.</li>
        ) : (
          projects.map((project) => (
            <ProjectItem key={project.id}>
              <div>
                <strong>{project.name}</strong> - <em>마감일: {project.duedate}</em>
              </div>
              <div>참여자: {project.participants.join(", ")}</div>
              <Button onClick={() => alert(`상세보기: ${project.name}`)}>상세보기</Button>
            </ProjectItem>
          ))
        )}
      </ul>
    </ProjectContainer>
  );
};

export default ProjectListWidget;
