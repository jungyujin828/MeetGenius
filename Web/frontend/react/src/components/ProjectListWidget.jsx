import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

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

const ProjectListWidget = () => {
  const [projects, setProjects] = useState([]); // 프로젝트 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);     // 에러 상태

  // 프로젝트 목록을 서버에서 가져오는 함수
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/projects/", {
        withCredentials: true, // 쿠키 포함
      });
      setProjects(response.data);  // 가져온 데이터를 상태에 저장
      setLoading(false); // 로딩 완료
    } catch (error) {
      setError("프로젝트 목록을 불러오는 데 실패했습니다.");
      setLoading(false); // 로딩 완료
      console.error("프로젝트 목록 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchProjects(); // 컴포넌트가 처음 렌더링될 때 프로젝트 목록을 가져옵니다.
  }, []);

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
