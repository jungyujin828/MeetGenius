import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

// 스타일 컴포넌트 정의
const DetailContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 80vh;
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
  const [files, setFiles] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    startdate: '',
    duedate: '',
    participants: []
  });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchFiles = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error('[파일 목록 조회] 인증 토큰 없음');
      return;
    }

    try {
      console.log('[파일 목록 조회] 시작:', { projectId });
      
      const response = await axios.get(
        `${baseURL}/projects/${projectId}/all_reports/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          }
        }
      );

      console.log('[파일 목록] 응답:', response.data);
      if (Array.isArray(response.data)) {
        setFiles(response.data);
      } else {
        console.error('[파일 목록] 예상치 못한 응답 형식:', response.data);
      }
    } catch (error) {
      console.error('[파일 목록 조회] 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectId
      });
    }
  };

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("로그인된 사용자만 프로젝트 상세를 볼 수 있습니다.");
          setLoading(false);
          return;
        }
        const response = await axios.get(`${baseURL}/projects/${projectId}/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        setProject(response.data);
        setFormData({
          name: response.data.name,
          description: response.data.description,
          department: response.data.department,
          startdate: response.data.startdate,
          duedate: response.data.duedate,
          participants: response.data.participants || []
        });
        setLoading(false);
      } catch (error) {
        setError("프로젝트 상세 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchProjectDetail();
    fetchDepartments();
    fetchUsers();
    fetchFiles();
  }, [projectId]);

  const fetchDepartments = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("로그인된 사용자만 부서 목록을 조회할 수 있습니다.");
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/accounts/departments/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      setDepartments(response.data);
    } catch (error) {
      setError("부서 목록을 불러오는 데 실패했습니다.");
    }
  };

  const fetchUsers = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("로그인된 사용자만 유저 목록을 조회할 수 있습니다.");
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/accounts/users/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      setError("유저 목록을 불러오는 데 실패했습니다.");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const allowedExtensions = ['.txt', '.docx'];
    const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      alert("txt 또는 docx 파일만 업로드 가능합니다.");
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("로그인된 사용자만 파일을 업로드할 수 있습니다.");
      return;
    }

    try {
      console.log('[파일 업로드] 시작:', {
        fileName: file.name,
        fileType: file.type,
        projectId: projectId
      });

      const response = await axios.post(
        `${baseURL}/projects/${projectId}/upload_report/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${authToken}`,
          }
        }
      );
      
      console.log('[파일 업로드] 응답:', response.data);
      
      if (response.data.reports) {
        alert("파일 업로드가 완료되었습니다.");
        await fetchFiles();
      }
      
    } catch (error) {
      console.error('[파일 업로드] 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        projectId: projectId
      });
      
      if (error.response?.data?.error?.includes('FastAPI')) {
        alert("파일이 업로드되었습니다.");
        await fetchFiles();
      } else {
        alert(error.response?.data?.error || "파일 업로드에 실패했습니다.");
      }
    } finally {
      event.target.value = '';
    }
  };

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
      setProject(response.data);
      setEditMode(false);
      alert("프로젝트 수정이 완료되었습니다.");
    } catch (error) {
      setError("프로젝트 수정에 실패했습니다.");
    }
  };

  if (loading) return <Overlay><DetailContainer>로딩 중...</DetailContainer></Overlay>;
  if (error) return <Overlay><DetailContainer>{error}</DetailContainer></Overlay>;
  if (!project) return null;

  return (
    <>
      <Overlay onClick={onClose} />
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
            <div>
              <h4>참여자 수정</h4>
              {users.map((user) => (
                <UserItem key={user.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.participants.some(p => p.id === user.id)}
                      onChange={() => {
                        if (formData.participants.some(p => p.id === user.id)) {
                          setFormData({
                            ...formData,
                            participants: formData.participants.filter(p => p.id !== user.id)
                          });
                        } else {
                          setFormData({
                            ...formData,
                            participants: [...formData.participants, { id: user.id, authority: 0 }]
                          });
                        }
                      }}
                    />
                    {user.name}
                  </label>
                  <div>
                    <label>
                      마스터 권한
                      <input
                        type="checkbox"
                        checked={formData.participants.some(p => p.id === user.id && p.authority === 0)}
                        onChange={() => {
                          setFormData({
                            ...formData,
                            participants: formData.participants.map(p =>
                              p.id === user.id ? { ...p, authority: p.authority === 1 ? 0 : 1 } : p
                            ),
                          });
                        }}
                      />
                    </label>
                  </div>
                </UserItem>
              ))}
            </div>
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
                    <DeleteIcon onClick={() => alert(`파일 삭제: ${file.title}`)}>❌</DeleteIcon>
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
                  accept=".txt,.docx"
                />
                <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                  파일 추가 (.txt, .docx)
                </label>
              </Button>
              <Button onClick={() => setEditMode(true)}>수정</Button>
              <Button onClick={() => alert("프로젝트 삭제")}>삭제</Button>
            </ButtonContainer>
          </div>
        )}
      </DetailContainer>
    </>
  );
};

export default ProjectDetail;
