import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { deleteProject, deleteReport, fetchFiles } from "../api/project";
import { fetchUserInfo, fetchDepartments } from "../api/userApi";

// 스타일 컴포넌트 정의
const DetailContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 350px; /* ✅ 전체 공간 차지 방지 */
  max-height: 1000px; /* ✅ 높이 제한 */
  overflow-y: auto; /* ✅ 내용이 많을 경우 스크롤 */
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #274c77;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 25px;
  background-color: #274c77;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  flex: 1;
  margin: 5px;

  &:hover {
    background-color: #1b3a57;
  }
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const SelectField = styled.select`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const TextareaField = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  min-height: 100px;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`;

const FileItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
`;

const DeleteIcon = styled.span`
  color: red;
  cursor: pointer;
  font-weight: bold;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;

const baseURL = import.meta.env.VITE_APP_BASEURL;


const ProjectDetail = ({ projectId, onClose }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]); // 파일 목록 상태
  const [editMode, setEditMode] = useState(false); // 수정 모드 상태
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    startdate: '',
    duedate: '',
    participants: []
  }); // 수정할 폼 데이터
  const [departments, setDepartments] = useState([]); // 부서 목록
  const [users, setUsers] = useState([]); // 유저 목록

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("로그인된 사용자만 프로젝트 상세를 볼 수 있습니다.");
          setLoading(false);
          return;
        }

        // Fetching project details, files, users and departments
        const projectResponse = await axios.get(`${baseURL}/projects/${projectId}/`, {
          headers: { Authorization: `Token ${authToken}` }
        });
        const departmentResponse = await fetchDepartments();
        const usersResponse = await fetchUserInfo();
        const filesResponse = await fetchFiles(projectId);

        setProject(projectResponse.data);
        setDepartments(departmentResponse);
        setUsers(usersResponse);
        setFiles(filesResponse);

        setFormData({
          name: projectResponse.data.name,
          description: projectResponse.data.description,
          department: projectResponse.data.department,
          startdate: projectResponse.data.startdate.split("T")[0],
          duedate: projectResponse.data.duedate.split("T")[0],
          participants: projectResponse.data.participants || [],
        });

        setLoading(false);
      } catch (error) {
        setError("프로젝트 상세 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [projectId]); // projectId 변경 시마다 실행



  // 파일 업로드 함수
  const handleFileUpload = async (event) => {
    const formData = new FormData();
    formData.append("files", event.target.files[0]); // 파일 추가

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("로그인된 사용자만 파일을 업로드할 수 있습니다.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/projects/${projectId}/upload_report/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      if (response.data.reports) {
        setFiles((prevFiles) => [...prevFiles, ...response.data.reports]);
      }
      alert("파일 업로드가 완료되었습니다.");
    } catch (error) {
      setError("파일 업로드에 실패했습니다.");
    }
  };

  // 수정할 내용 저장
  const handleSaveEdit = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("로그인된 사용자만 수정할 수 있습니다.");
      return;
    }

    try {
      const response = await axios.patch(
        `${baseURL}/projects/${projectId}/`,
        formData,
        {
          headers: {
            "Authorization": `Token ${authToken}`,
            "Content-Type": "application/json"
          },
        }
      );
      setProject(response.data);  // 서버에서 반환된 데이터로 프로젝트 업데이트
      setEditMode(false);  // 수정 모드 종료
      alert("프로젝트 수정이 완료되었습니다.");
    } catch (error) {
      setError("프로젝트 수정에 실패했습니다.");
    }
  };

  if (loading) return <Overlay><DetailContainer>로딩 중...</DetailContainer></Overlay>;
  if (error) return <Overlay><DetailContainer>{error}</DetailContainer></Overlay>;
  if (!project) return null;

  const handleDeleteProject = async () => {
    if (!window.confirm("정말 이 프로젝트를 삭제하시겠습니까?")) {
      return;
    }
  
    try {
      const message = await deleteProject(projectId);
      alert(message);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeletReport = async (fileId) => {
    try {
      const message = await deleteReport(projectId, fileId);
      alert(message);
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error("파일 삭제 실패:", error);
    }
  };

   return (
    <>
    <DetailContainer>
    <CloseButton onClick={onClose}>&times;</CloseButton>
        <h3>프로젝트 상세보기</h3>
        {editMode ? (
          <div>
            <Label>프로젝트 이름</Label>
            <InputField
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Label>프로젝트 설명</Label>
            <TextareaField
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Label>부서</Label>
            <SelectField
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">부서 선택</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </SelectField>
            <Label>시작일</Label>
            <InputField
              type="date"
              value={formData.startdate}
              onChange={(e) => setFormData({ ...formData, startdate: e.target.value })}
            />
            <Label>마감일</Label>
            <InputField
              type="date"
              value={formData.duedate}
              onChange={(e) => setFormData({ ...formData, duedate: e.target.value })}
            />
            <Button onClick={handleSaveEdit}>저장</Button>
            <Button onClick={() => setEditMode(false)}>취소</Button>
          </div>
        ) : (
          <div>
            <p><strong>📌 프로젝트 명:</strong> {project.name}</p>
            <p><strong>📋 프로젝트 내용:</strong> {project.description}</p>
            <p><strong>🏢 담당부서:</strong> {project.department}</p>
            <p><strong>📅 마감일:</strong> {new Date(project.duedate).toLocaleString()}</p>
            <p><strong>👥 참여자:</strong> {project.participants.map(p => `${p.name} (${p.authority === 0 ? '마스터' : '참여자'})`).join(", ")}</p>

            <h4>📂 첨부 파일</h4>
            <FileList>
              {files.length > 0 ? (
                files.map((file, index) => (
                  <FileItem key={index}>
                    {file.title}
                    <DeleteIcon onClick={() => handleDeletReport(file.id)}>❌</DeleteIcon>
                  </FileItem>
                ))
              ) : (
                <p>첨부된 파일이 없습니다.</p>
              )}
            </FileList>

            <ButtonContainer>
              <Button>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor="file-upload">파일 추가</label>
              </Button>
              <Button onClick={() => setEditMode(true)}>수정</Button>
              <Button onClick={handleDeleteProject}>삭제</Button>
            </ButtonContainer>
          </div>
        )}
      </DetailContainer>
    </>
  );
};

export default ProjectDetail;
