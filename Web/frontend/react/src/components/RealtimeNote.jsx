import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const Header = styled.h3`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
`;

const Panel = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap; /* 화면 크기에 따라 자동으로 감김 */
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-height: 500px;
  overflow-y: scroll;
  min-width: 300px;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-height: 500px;
  overflow-y: scroll;
  min-width: 300px;
`;

const TextMessage = styled.div`
  margin: 10px 0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;

  ${props => props.type === "plain" && `
    background-color: #f8f9fa;
    color: #212529;
  `}

  ${props => props.type === "query" && `
    background-color: #e7f5ff;
    color: #1864ab;
    border-left: 4px solid #1864ab;
    
    &::before {
      content: "❓";
      margin-right: 8px;
    }
  `}

  ${props => props.type === "agenda_docs_update" && `
    background-color: #ebfbee;
    color: #2b8a3e;
    border-left: 4px solid #2b8a3e;
    
    &::before {
      content: "📄";
      margin-right: 8px;
    }
  `}
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #274c77;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #1b3a57;
  }
`;

const QueryMessage = styled.div`
  padding: 12px;
  background-color: #e8e8e8;
  border-radius: 6px;
  margin-top: 10px;
`;

const DocumentLink = styled.a`
  display: block;
  margin-top: 10px;
  padding: 10px;
  background-color: #e8e8e8;
  border-radius: 6px;
  text-decoration: none;
  color: #274c77;

  &:hover {
    background-color: #d3d3d3;
  }
`;

const MeetingInfo = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
`;

const InfoItem = styled.div`
  h4 {
    color: #274c77;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
  }
  p {
    color: #333;
    font-size: 16px;
    background-color: #f8f9fa;
    padding: 8px;
    border-radius: 4px;
    margin: 0;
  }
`;

const RealtimeNote = () => {
  const { meetingId } = useParams();  // URL에서 meetingId 가져오기
  const [sttText, setSttText] = useState([]);
  const [queryMessage, setQueryMessage] = useState(""); // 쿼리 메시지
  const [documents, setDocuments] = useState([]); // RAG 문서 목록
  const [meetingState, setMeetingState] = useState(""); // 회의 상태
  const [ragList, setRagList] = useState([]); // 새로운 RAG 문서 목록
  const [error, setError] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState(null);

  // 메시지 수신 처리
  const handleMessage = useCallback((message) => {
    console.log('받은 메시지:', message);
    
    if (message.type && message.message) {
      setSttText(prev => [...prev, {
        type: message.type,
        message: message.message
      }]);
    }
  }, []);

  // 메시지 렌더링
  const renderMessages = () => {
    return sttText.map((item, index) => (
      <TextMessage key={index} type={item.type}>
        {item.message}
      </TextMessage>
    ));
  };

  useEffect(() => {
    // SSE 연결 (서버에서 보내는 실시간 데이터 받기)
    const eventSource = new EventSource("http://127.0.0.1:8000/meetings/stream/");

    // 서버에서 보내는 메시지를 실시간으로 받음
    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);  // JSON 형식으로 파싱
      console.log("받은 메시지:", message);
      console.log("STT 리스트:", message.stt_list); // stt_list 배열 확인

      if (message.stt_list && message.stt_list.length > 0) {
        setSttText((prevText) => {
          // 기존 배열과 새로운 stt_list를 병합해서 상태 업데이트
          return [...prevText, ...message.stt_list.map(text => ({
            type: "plain",
            message: text
          }))];
        });
      }

      // 받은 단일 메시지가 있을 경우 추가하기
      if (message.message) {
        setSttText((prevText) => [...prevText, {
          type: "plain",
          message: message.message
        }]);
      }

      // type별로 분기하여 처리
      switch (message.type) {
        case "plain":
          if (message.stt_list) {
            // stt_list가 배열로 들어오기 때문에 이를 배열에 추가
            setSttText((prevText) => [...prevText, ...message.stt_list.map(text => ({
              type: "plain",
              message: text
            }))]);  // stt_list의 텍스트 추가
          }
          break;
        case "query":
          setQueryMessage(message.message);  // 쿼리 메시지 처리
          break;
        case "agenda_docs_update":
          setDocuments((prevDocs) => {
            const newDocs = message.documents.filter(doc => !prevDocs.includes(doc)); // 중복 방지
            return [...prevDocs, ...newDocs];  // RAG 문서 업데이트
          });
          break;
        case "meeting_state":
          setMeetingState(message.meeting_state);  // 회의 상태 업데이트
          break;
        case "rag":
          setRagList((prevRagList) => {
            const newRagDocs = message.documents || [];  // RAG 문서가 없을 경우 빈 배열 처리
            return [...prevRagList, ...newRagDocs];
          });
          break;
        default:
          console.log("알 수 없는 타입:", message.type);
      }
    };

    // 오류 처리
    eventSource.onerror = (error) => {
      console.error("SSE Error: ", error);
      setError("서버와 연결할 수 없습니다. 다시 시도해주세요.");  // 오류 메시지 표시
      eventSource.close(); // 오류 발생 시 연결 종료
    };

    return () => {
      eventSource.close(); // 컴포넌트가 언마운트될 때 SSE 종료
    };
  }, []);

  // 회의 정보 불러오기
  useEffect(() => {
    const fetchMeetingInfo = async () => {
      try {
        const response = await axiosInstance.get(`/meetingroom/booked/${meetingId}/`);
        console.log("회의 정보:", response.data);
        setMeetingInfo(response.data);
      } catch (error) {
        console.error("회의 정보 로드 중 오류:", error);
        setError("회의 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchMeetingInfo();
  }, [meetingId]);

  // 날짜 포맷팅 함수
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Container>
      <Header>실시간 회의록 (STT)</Header>
      <Panel>
        <LeftPanel>
          {sttText.length > 0 ? (
            sttText.map((text, index) => {
              switch(text.type) {
                case "plain":
                  return (
                    <TextMessage key={index} type="plain">
                      {text.message}
                    </TextMessage>
                  );
                case "query":
                  return (
                    <TextMessage key={index} type="query">
                      {text.message.startsWith('질문 :') ? text.message : `질문 : ${text.message}`}
                    </TextMessage>
                  );
                case "agenda_docs_update":
                  return (
                    <TextMessage key={index} type="agenda_docs_update">
                      {text.message}
                      {text.documents && text.documents.length > 0 && (
                        <div style={{ marginTop: '8px', fontSize: '13px' }}>
                          {text.documents.map((doc, docIndex) => (
                            <a 
                              key={docIndex}
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'block',
                                marginTop: '4px',
                                color: '#2b8a3e',
                                textDecoration: 'underline'
                              }}
                            >
                              관련 문서 #{docIndex + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </TextMessage>
                  );
                default:
                  return null;
              }
            })
          ) : (
            <p>로딩 중...</p>
          )}
        </LeftPanel>
      </Panel>
    </Container>
  );
};

export default RealtimeNote;
