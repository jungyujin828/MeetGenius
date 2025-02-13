import React, { useState, useEffect } from "react";

const RealtimeNote = () => {
  const [sttText, setSttText] = useState(""); // 실시간 STT 텍스트

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:8000/api/stt/");

    eventSource.onmessage = (event) => {
      setSttText((prevText) => prevText + event.data); // 실시간으로 텍스트 추가
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error: ", error);
      eventSource.close(); // 오류가 발생하면 연결을 종료
    };

    return () => {
      eventSource.close(); // 컴포넌트가 언마운트되면 SSE 연결 종료
    };
  }, []);

  return (
    <div>
      <h3>실시간 회의록 (STT)</h3>
      <div>{sttText}</div>
    </div>
  );
};

export default RealtimeNote;
