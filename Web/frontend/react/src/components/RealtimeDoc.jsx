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
    if (!projectData) {
      console.error('[문서 조회] 프로젝트 정보 없음');
      return;
    }

    const actualProjectId = typeof projectData === 'object' ? projectData.id : projectData;

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
      console.error('[문서 조회] 에러:', error);
    }
  };

  useEffect(() => {
    if (meetingInfo?.project) {
      fetchDocuments();
    }
  }, [meetingInfo]);

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
  };

  return (
    <DocContainer>
      <DocList>
        {documents.map((doc, index) => (
          <DocItem 
            key={index}
            onClick={() => handleDocClick(doc)}
            isSelected={selectedDoc?.id === doc.id}
          >
            {doc.title || `문서 ${index + 1}`}
          </DocItem>
        ))}
      </DocList>
      
      {selectedDoc && (
        <DocContent>
          <DocTitle>{selectedDoc.title}</DocTitle>
          <DocText>{selectedDoc.content}</DocText>
        </DocContent>
      )}
    </DocContainer>
  );
};

const DocContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
`;

const DocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DocItem = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #274c77;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    background: white;
    border-color: #274c77;
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(39, 76, 119, 0.1);

    &::before {
      opacity: 1;
    }
  }
`;

const DocTitle = styled.h3`
  margin: 0;
  padding-bottom: 24px;
  font-size: 16px;
  color: #1a202c;
  font-weight: 600;
  line-height: 1.4;
  border-bottom: 1px solid #e2e8f0;
`;

const DocContent = styled.p`
  margin: 0;
  padding-top: 40px;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DocText = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export default RealtimeDoc;