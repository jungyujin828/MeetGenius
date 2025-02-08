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
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();


// ✅ 모든 유저 목록 불러오기 (부서 필터 없음)
useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    const url = "http://127.0.0.1:8000/accounts/users/"; // 모든 유저 불러오는 엔드포인트
    const response = await axios.get(url, { withCredentials: true });
    console.log("Fetched users:", response.data);
    setUsers(response.data);
  } catch (error) {
    setError("유저 목록을 불러오는 데 실패했습니다.");
    console.error("유저 목록 불러오기 오류:", error);
  }
};

// ✅ CSRF 토큰 가져오기 함수 (쿠키에서 추출)
function getCSRFToken() {
  let csrfToken = null;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("csrftoken=")) {
      csrfToken = cookie.substring("csrftoken=".length, cookie.length);
    }
  }
  return csrfToken;
}

const handleCreateProject = async () => {
  const csrftoken = getCSRFToken();
  if (!csrftoken) {
    console.error("CSRF Token이 없습니다.");
    alert("CSRF 토큰이 없습니다. 새로고침 후 다시 시도하세요.");
    return;
  }

  const formData = {
    name: projectName,
    description: projectDescription,
    startdate: startDate,
    duedate: dueDate,
    participants: participants.map(p => ({ id: p.id, authority: p.authority })),
  };

  try {
    const response = await axiosInstance.post("/projects/", formData, {
      withCredentials: true, // 세션 쿠키 포함
    });

    console.log("🟢 프로젝트 생성 성공:", response.data);
    dispatch(addProject(response.data));
    alert("프로젝트가 생성되었습니다.");
    
  } catch (error) {
    console.error("🔴 프로젝트 생성 실패:", error);
    if (error.response) {
      console.log("🔴 서버 응답:", error.response);
      alert(`프로젝트 생성 실패: ${error.response.data.detail || "알 수 없는 오류"}`);
    } else {
      alert("네트워크 오류가 발생했습니다.");
    }
  }
};

  
  // 유저 선택 처리 (마스터 권한 설정)
  const handleUserSelect = (event) => {
    const userId = parseInt(event.target.value, 10);
    const isChecked = event.target.checked;
    const selectedUser = users.find(user => user.employee_number === userId); // employee_number 사용

    if (isChecked) {
      setParticipants(prev => [...prev, { id: userId, name: selectedUser.name, department: selectedUser.department, position: selectedUser.position, authority: 0 }]);
    } else {
      setParticipants(prev => prev.filter(participant => participant.id !== userId));
    }
  };

  // 권한 변경 (마스터 권한 체크박스)
  const handleAuthorityChange = (userId) => {
    setParticipants(prev =>
      prev.map(participant =>
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
      <SelectField
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">담당 부서 선택</option>
        <option value="1">개발팀</option>
        <option value="2">마케팅팀</option>
        <option value="3">인사팀</option>
      </SelectField>
      <DateInput
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <DateInput
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <UserSelectContainer>
        <h4>참여자 선택</h4>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {users.map((user) => (
          <UserItem key={user.employee_number}>
            <label>
              <input
                type="checkbox"
                value={user.employee_number}
                checked={participants.some(p => p.id === user.employee_number)}
                onChange={handleUserSelect}
              />
              {user.name} ({user.department} / {user.position}) {/* 유저 이름, 부서명, 직급 */}
            </label>
            <div>
              <label>
                마스터 권한
                <input
                  type="checkbox"
                  checked={participants.some(p => p.id === user.employee_number && p.authority === 1)}
                  onChange={() => handleAuthorityChange(user.employee_number)}
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
