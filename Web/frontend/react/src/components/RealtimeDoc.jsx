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
  border: ${props => props.isSelected ? '2px solid #666' : 'none'};

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

const DocContent = styled.div`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const DocText = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export default RealtimeDoc;