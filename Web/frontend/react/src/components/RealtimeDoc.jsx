import React, { useState, useEffect } from "react";
import styled from "styled-components";

const RealtimeDoc = ({ meetingInfo, documents }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  console.log("documents",documents)

  return (
<DocContainer>
  <DocList>
    {documents.length > 0 ? (
      documents.map((doc, index) => (
        <DocItem 
          key={doc.id || index}  // id가 없을 경우 index 사용
          onClick={() => handleDocClick(doc)}
          isSelected={selectedDoc?.id === doc.id}
        >
          {`${doc.title} - ${doc.content}`} {/* 템플릿 리터럴 사용 */}
        </DocItem>
      ))
    ) : (
      <p>📂 문서가 없습니다.</p>  // 문서가 없을 경우 메시지 표시
    )}
  </DocList>
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