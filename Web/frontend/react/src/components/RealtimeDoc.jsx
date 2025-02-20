import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

const RealtimeDoc = ({ meetingInfo, documents = [] }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // documents가 없거나 빈 배열일 때 사용할 기본 문서
  const defaultDoc = {
    id: 0,
    title: "관련 문서 없음",
    content: "현재 안건과 관련된 문서가 없습니다."
  };

  // documents 유효성 검사 및 기본값 처리
  const docs = useMemo(() => {
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return [defaultDoc];
    }
    return documents;
  }, [documents]);

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
  };

  return (
    <DocContainer>
      <DocList>
        {docs.map((doc, index) => (
          <DocItem 
            key={doc.id || index}
            onClick={() => handleDocClick(doc)}
            isSelected={selectedDoc?.id === doc.id}
          >
            <DocTitle>{doc.title}</DocTitle>
            <DocContent>{doc.content}</DocContent>
          </DocItem>
        ))}
      </DocList>
      {selectedDoc && (
        <DocDetail>
          <h3>{selectedDoc.title}</h3>
          <p>{selectedDoc.content}</p>
        </DocDetail>
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
  padding-bottom: 8px;
  font-size: 16px;
  color: #1a202c;
  font-weight: 600;
  line-height: 1.4;
`;

const DocContent = styled.p`
  margin: 0;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DocDetail = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
  
  h3 {
    margin: 0 0 12px 0;
    color: #1a202c;
  }
  
  p {
    margin: 0;
    color: #4a5568;
    line-height: 1.6;
  }
`;

export default RealtimeDoc;