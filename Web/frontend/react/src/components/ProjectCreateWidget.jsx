import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addProject } from "../redux/projectSlice"; // 리덕스 액션 가져오기
import axiosInstance from "../api/axiosInstance";  // ✅ axiosInstance import 추가

// 스타일 컴포넌트 설정
const ProjectFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  max-width: 300px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TextareaField = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 100px;
`;

const SelectField = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #274c77;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1b3a57;
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const UserSelectContainer = styled.div`
  margin-bottom: 20px;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ProjectCreateWidget = ({ fetchProjects }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [participants, setParticipants] = useState([]); // 참여자 상태
  const [users, setUsers] = useState([]); // 유저 목록
  const [error, setError] = useState(null); // 에러 상태

  const dispatch = useDispatch();

  // 모든 유저 목록 불러오기
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const url = "http://127.0.0.1:8000/accounts/users/"; // 모든 유저 불러오는 엔드포인트
      const response = await axios.get(url, { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      setError("유저 목록을 불러오는 데 실패했습니다.");
      console.error("유저 목록 불러오기 오류:", error);
    }
  };

  // 프로젝트 생성 핸들러
  const handleCreateProject = async () => {
    const authToken = localStorage.getItem("authToken"); // localStorage에서 토큰 가져오기


    const formData = {
      name: projectName,
      description: projectDescription,
      startdate: startDate,
      duedate: dueDate,
      participants: participants.map((p) => ({ id: p.id, authority: p.authority })),
    };

    try {
      const response = await axiosInstance.post("/projects/", formData, {
        withCredentials: true,
        headers: {
          "Authorization": `Token ${authToken}`, // 인증 토큰
        },
      });

      console.log("🟢 프로젝트 생성 성공:", response.data);
      dispatch(addProject(response.data));
      alert("프로젝트가 생성되었습니다.");
    } catch (error) {
      console.error("🔴 프로젝트 생성 실패:", error);
      if (error.response) {
        alert(`프로젝트 생성 실패: ${error.response.data.detail || "알 수 없는 오류"}`);
      } else {
        alert("네트워크 오류가 발생했습니다.");
      }
    }
  };

  // 유저 선택 처리 (체크박스 클릭 시)
  const handleUserSelect = (event) => {
    const userId = event.target.value; // 체크박스의 value 값 (문자열로 받기)
    const isChecked = event.target.checked; // 체크박스의 선택 여부

    // 선택된 유저를 찾음
    const selectedUser = users.find((user) => user.employee_number === userId);

    if (selectedUser) {
      if (isChecked) {
        setParticipants((prev) => [
          ...prev,
          {
            id: userId,
            name: selectedUser.name,
            department: selectedUser.department,
            position: selectedUser.position,
            authority: 1, // 기본 권한
          },
        ]);
      } else {
        setParticipants((prev) => prev.filter((participant) => participant.id !== userId));
      }
    }
  };

  // 권한 변경 (마스터 권한 체크박스)
  const handleAuthorityChange = (userId) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === userId
          ? { ...participant, authority: participant.authority === 0 ? 1 : 0 }
          : participant
      )
    );
  };

  return (
    <ProjectFormContainer>
      <h3>프로젝트 생성</h3>
      <InputField
        type="text"
        placeholder="프로젝트명"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <TextareaField
        placeholder="프로젝트 설명"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
      />
      <SelectField value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">담당 부서 선택</option>
        <option value="1">개발팀</option>
        <option value="2">마케팅팀</option>
        <option value="3">인사팀</option>
      </SelectField>
      <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <DateInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <UserSelectContainer>
        <h4>참여자 선택</h4>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {users.map((user) => (
          <UserItem key={user.employee_number}>
            <label>
              <input
                type="checkbox"
                value={user.employee_number}
                checked={participants.some((p) => p.id === user.employee_number)} // 체크박스 상태 확인
                onChange={handleUserSelect} // 체크박스 선택 처리
              />
              {user.name} ({user.department} / {user.position})
            </label>
            <div>
              <label>
                마스터 권한
                <input
                  type="checkbox"
                  checked={participants.some((p) => p.id === user.employee_number && p.authority === 1)} // 권한 체크 상태
                  onChange={() => handleAuthorityChange(user.employee_number)} // 권한 변경
                />
              </label>
            </div>
          </UserItem>
        ))}
      </UserSelectContainer>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleCreateProject}>생성</Button>
        <Button onClick={() => alert("취소")}>취소</Button>
      </div>
    </ProjectFormContainer>
  );
};

export default ProjectCreateWidget;
