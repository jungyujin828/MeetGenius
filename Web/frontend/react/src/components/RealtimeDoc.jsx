import React, { useState, useEffect } from "react";
import axios from "axios";

const RealtimeDoc = () => {
  const [documentContent, setDocumentContent] = useState(""); // 문서 내용

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/rag/");
        setDocumentContent(response.data.document); // 받아온 문서 내용
      } catch (error) {
        console.error("문서 로딩 실패", error);
      }
    };

    fetchDocument();
  }, []);

  return (
    <div>
      <h3>회의 문서 (RAG)</h3>
      <div>{documentContent}</div>
    </div>
  );
};

export default RealtimeDoc;
