import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const RealtimeDoc = ({ meetingInfo }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const baseURL = import.meta.env.VITE_APP_BASEURL;

  const fetchDocuments = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error('[문서 조회] 인증 토큰 없음');
      return;
    }

    // project 객체에서 ID 값 추출
    const projectData = meetingInfo?.project;
    const actualProjectId = projectData?.id || projectData;

    console.log('[문서 조회] 프로젝트 데이터:', {
      projectData,
      actualProjectId,
      meetingInfo,
      typeOfProject: typeof projectData,
      typeOfId: typeof actualProjectId
    });

    if (!actualProjectId || typeof actualProjectId === 'object') {
      console.error('[문서 조회] 유효한 프로젝트 ID 없음:', { 
        projectData,
        actualProjectId,
        meetingInfo 
      });
      return;
    }

    try {
      const url = `${baseURL}/projects/${actualProjectId}/all_reports/`;
      console.log('[문서 조회] 요청 URL:', url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${authToken}`,
        }
      });
      
      console.log('[문서 목록] 응답:', response.data);
      
      const documentList = Array.isArray(response.data) ? response.data : 
                         response.data.reports ? response.data.reports : [];
      
      console.log('[문서 목록] 처리된 데이터:', documentList);
      setDocuments(documentList);

    } catch (error) {
      console.error('[문서 목록 조회] 에러:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        projectId: actualProjectId,
        url: `${baseURL}/projects/${actualProjectId}/all_reports/`
      });
    }
  };

  useEffect(() => {
    if (meetingInfo) {
      console.log('[RealtimeDoc] meetingInfo 변경:', {
        meetingInfo,
        project: meetingInfo.project,
        projectType: typeof meetingInfo.project
      });
      fetchDocuments();
    }
  }, [meetingInfo]);

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
  };

  const closeModal = () => {
    setSelectedDoc(null);
  };

  return (
    <DocContainer>
      <h2>DB</h2>
      <DocList>
        {documents && documents.length > 0 ? (
          documents.map((doc, index) => (
            <DocItem 
              key={doc.id || index}
              onClick={() => handleDocClick(doc)}
            >
              <DocTitle>
                {doc.file_name || doc.title || '제목 없음'}
              </DocTitle>
              <DocContent>
                {doc.content?.substring(0, 50) || doc.text?.substring(0, 50)}
                {(doc.content?.length > 50 || doc.text?.length > 50) && '...'}
              </DocContent>
            </DocItem>
          ))
        ) : (
          <EmptyMessage>
            {meetingInfo ? 
              '등록된 문서가 없거나 로딩 중입니다...' : 
              '프로젝트 정보를 불러오는 중...'}
          </EmptyMessage>
        )}
      </DocList>
      <ButtonContainer>
        <Button>다음 안건</Button>
        <Button>회의 종료</Button>
      </ButtonContainer>

      {selectedDoc && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {selectedDoc.file_name || selectedDoc.title || '제목 없음'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              {selectedDoc.content || selectedDoc.text}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </DocContainer>
  );
};

const DocContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin: 0 0 20px 0;
    color: #333;
  }
`;

const DocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const DocItem = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #eeeeee;
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
`;

const DocTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #444;
`;

const DocContent = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #666;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #555;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ContentPreview = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0 5px;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  overflow-y: auto;
  padding: 10px;
  line-height: 1.6;
  color: #444;
  white-space: pre-wrap;
  max-height: calc(80vh - 100px);
`;

export default RealtimeDoc;