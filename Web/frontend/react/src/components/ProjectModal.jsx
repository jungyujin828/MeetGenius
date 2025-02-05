import React, { useState } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    color: #0056b3;
  }
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProjectModal = ({ onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 프로젝트 생성 API 호출 및 로직을 작성합니다.
    console.log({ projectName, projectDescription, department, dueDate });
    onClose(); // 모달 닫기
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>X</CloseButton>
        <h3>프로젝트 생성</h3>
        <form onSubmit={handleSubmit}>
          <FormField>
            <label>프로젝트명</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </FormField>
          <FormField>
            <label>프로젝트 설명</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
            />
          </FormField>
          <FormField>
            <label>담당 부서</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </FormField>
          <FormField>
            <label>마감일</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </FormField>
          <Button type="submit">프로젝트 생성</Button>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ProjectModal;
