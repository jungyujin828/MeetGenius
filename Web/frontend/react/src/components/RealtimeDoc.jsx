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