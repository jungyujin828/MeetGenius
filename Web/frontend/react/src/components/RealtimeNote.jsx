import React, { useState, useEffect, useCallback, useRef } from "react";
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
  margin: 12px 0;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  
  ${props => props.type === "plain" && `
    color: #1a202c;
    padding-left: 16px;
  `}

  ${props => props.type === "query" && `
    background-color:rgb(243, 243, 243);
    position: relative;
    padding-left: 44px;
    border: 1px solidrgb(219, 235, 255);
    
    &::before {
      content: "💭";
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
    }
  `}

  ${props => props.type === "agenda_docs_update" && `
    background-color: #EEF2F7;
    position: relative;
    padding-left: 44px;
    border: 1px solid #E5E9F0;
    
    &::before {
      content: "🤖";
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
    }
  `}
`;

const ButtonContainer = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  margin-top: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NextButton = styled(Button)`
  background-color: #1e40af;  // 진한 남색
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #1e3a8a;
    transform: translateY(-1px);
  }

`;

const EndButton = styled(Button)`
  background-color: white;
  color: #dc2626;  // 빨간색
  border: 1px solid #dc2626;
  
  &:hover:not(:disabled) {
    background-color: #fee2e2;  // 연한 빨간색 배경
    border-color: #b91c1c;
    color: #b91c1c;
  }


`;

const QueryMessage = styled.div`
  padding: 12px;
  background-color: #e8e8e8;
  border-radius: 6px;
  margin-top: 10px;
`;

const DocumentList = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #E5E9F0;
`;

const DocumentLink = styled.div`
  padding: 10px 12px;
  margin: 4px 0;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  font-size: 13px;
  color: #274c77;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: translateX(4px);
  }

  &::before {
    content: "📑";
    margin-right: 10px;
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

const AgendaDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  gap: 12px;
  
  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #274c77, transparent);
    opacity: 0.3;
  }
`;

const AgendaHeader = styled.div`
  font-size: 24px;
  color: #274c77;
  font-weight: 700;
  padding: 16px 0;
  margin: 8px 0 16px 0;
  
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    font-size: 20px;
  }
`;

const NoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const NoteContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const RealtimeNote = ({ meetingInfo, currentAgendaNum, onEndMeeting }) => {
  const { meetingId } = useParams();
  const [sttText, setSttText] = useState([]);
  const [queryMessage, setQueryMessage] = useState(""); // 쿼리 메시지
  const [documents, setDocuments] = useState([]); // RAG 문서 목록
  const [meetingState, setMeetingState] = useState(""); // 회의 상태
  const [ragList, setRagList] = useState([]); // 새로운 RAG 문서 목록
  const [error, setError] = useState(null);
  const [currentAgenda, setCurrentAgenda] = useState(null);
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [actualCurrentAgenda, setActualCurrentAgenda] = useState(currentAgendaNum);
  const [accumulatedMessages, setAccumulatedMessages] = useState(() => {
    // localStorage에서 저장된 메시지 불러오기
    const saved = localStorage.getItem(`meeting_${meetingId}_messages`);
    return saved ? JSON.parse(saved) : [];
  });
  const noteContentRef = useRef(null); // 추가: NoteContent에 대한 ref
  
  // 누적 메시지가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(`meeting_${meetingId}_messages`, JSON.stringify(accumulatedMessages));
  }, [accumulatedMessages, meetingId]);

  // SSE 메시지 수신 처리
  useEffect(() => {
    const baseUrl = axiosInstance.defaults.baseURL;
    const eventSource = new EventSource(`${baseUrl}/meetings/stream/`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE] 받은 데이터:', data);

        // cur_agenda 업데이트 처리
        if (data.cur_agenda) {
          setActualCurrentAgenda(parseInt(data.cur_agenda));
        }

        // 초기 데이터 처리
        if (data.stt_list && accumulatedMessages.length === 0) {
          const initialMessages = [];
          
          // 모든 안건에 대한 구분선과 제목 추가
          meetingInfo?.meeting_agendas?.forEach((agenda, index) => {
            if (index === 0) {
              initialMessages.push({
                type: "divider",
                timestamp: new Date().toISOString(),
                agendaNumber: agenda.order
              });
              
              initialMessages.push({
                type: "agenda_change",
                message: `안건 ${agenda.order}. ${agenda.title}`,
                timestamp: new Date(new Date().getTime() + 1).toISOString(),
                agendaNumber: agenda.order
              });
            }
          });

          // STT 메시지 처리
          const newMessages = data.stt_list.map(msg => ({
            message: msg,
            type: "plain",
            timestamp: new Date().toISOString(),
            agendaNumber: actualCurrentAgenda // 현재 안건 번호 추가
          }));
          
          // 현재 안건의 메시지만 업데이트
          setSttText(newMessages);
          
          // 누적 메시지에 추가 (초기 구분선/제목 + 메시지)
          setAccumulatedMessages([...initialMessages, ...newMessages]);
        }

        // 실시간 메시지 처리
        if (data.type && data.message) {
          const messageWithTimestamp = {
            ...data,
            timestamp: new Date().toISOString(),
            agendaNumber: actualCurrentAgenda // 현재 안건 번호 추가
          };

          // 현재 안건의 실시간 메시지 추가
          setSttText(prevMessages => {
            const newMessages = [...prevMessages, messageWithTimestamp];
            return newMessages.sort((a, b) => 
              new Date(a.timestamp) - new Date(b.timestamp)
            );
          });

          // 누적 메시지에도 추가
          setAccumulatedMessages(prev => [...prev, messageWithTimestamp]);
        }
      } catch (error) {
        console.error('[SSE] 메시지 처리 오류:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[SSE] 연결 에러:', error);
      eventSource.close();
    };

    // 로컬 스토리지에서 이전 데이터 복원
    // const savedSTT = localStorage.getItem(`meeting_${meetingId}_stt`);
    // if (savedSTT) {
    //   try {
    //     const parsedSTT = JSON.parse(savedSTT);
    //     console.log('[LocalStorage] 저장된 데이터 복원:', parsedSTT);
    //     setSttText(parsedSTT);
    //   } catch (error) {
    //     console.error('[LocalStorage] 데이터 복원 중 에러:', error);
    //   }
    // }

    return () => eventSource.close();
  }, [meetingId, actualCurrentAgenda]);

  // 메시지 그룹화 처리
  const groupMessages = useCallback((messages) => {
    const grouped = [];
    let currentGroup = null;

    messages.forEach((msg) => {
      if (!currentGroup || currentGroup.type !== msg.type) {
        if (currentGroup) {
          grouped.push(currentGroup);
        }
        currentGroup = {
          type: msg.type,
          messages: [msg.message],
          documents: msg.documents,
          timestamp: new Date()
        };
      } else {
        currentGroup.messages.push(msg.message);
        if (msg.documents) {
          currentGroup.documents = [...(currentGroup.documents || []), ...msg.documents];
        }
      }
    });

    if (currentGroup) {
      grouped.push(currentGroup);
    }

    return grouped;
  }, []);

  // 현재 안건 정보 설정
  useEffect(() => {
    if (meetingInfo?.meeting_agendas) {
      const agenda = meetingInfo.meeting_agendas.find(a => a.order === actualCurrentAgenda);
      setCurrentAgenda(agenda);
    }
  }, [meetingInfo, actualCurrentAgenda]);

  // 다음 안건으로 이동
  const handleNextAgenda = async () => {
    try {
      const response = await axiosInstance.post('meetings/next_agenda/');
      console.log("다음 안건 응답:", response.data);
      
      console.log("현재 안건 번호:", actualCurrentAgenda);
      console.log("전체 안건:", meetingInfo.meeting_agendas);
      
      // 현재 실제 안건 번호 사용
      const nextAgendaNum = actualCurrentAgenda + 1;
      console.log("계산된 다음 안건 번호:", nextAgendaNum);
      
      // order 속성을 기준으로 현재 안건과 다음 안건 찾기
      const currentAgenda = meetingInfo.meeting_agendas.find(
        agenda => agenda.order === actualCurrentAgenda
      );
      const nextAgenda = meetingInfo.meeting_agendas.find(
        agenda => agenda.order === nextAgendaNum
      );
      
      if (nextAgenda) {
        // 안건 구분선 추가
        const dividerMessage = {
          type: "divider",
          timestamp: new Date().toISOString(),
          agendaNumber: nextAgendaNum
        };
        
        // 새 안건 시작 메시지 추가
        const agendaChangeMessage = {
          type: "agenda_change",
          message: `안건 ${nextAgenda.order}. ${nextAgenda.title}`,
          timestamp: new Date(new Date().getTime() + 1).toISOString(), // 구분선 다음에 표시되도록 1ms 추가
          agendaNumber: nextAgendaNum
        };
        
        // 누적 메시지에 구분선과 새 안건 시작 메시지 추가
        setAccumulatedMessages(prev => [...prev, dividerMessage, agendaChangeMessage]);
        
        // 현재 STT 초기화 (새로운 안건의 메시지를 위해)
        setSttText([]);
        
        alert(`${currentAgenda.title}에서 ${nextAgenda.title}로 이동합니다`);
      } else {
        alert("마지막 안건입니다.");
        console.log("더 이상 다음 안건이 없습니다.");
      }
    } catch (error) {
      console.error("다음 안건 이동 중 오류:", error);
      alert("다음 안건으로 이동하는 중 오류가 발생했습니다.");
    }
  };

  // 메시지 그룹화 처리 수정
  useEffect(() => {
    if (accumulatedMessages.length > 0) {
      setGroupedMessages(groupMessages(accumulatedMessages));
    }
  }, [accumulatedMessages, groupMessages]);

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

  // 회의 종료 핸들러
  const handleEndMeeting = () => {
    try {
      // localStorage 데이터 삭제
      localStorage.removeItem(`meeting_${meetingId}_messages`);
      
      // 상태 초기화
      setAccumulatedMessages([]);
      setSttText([]);
      
      // 상위 컴포넌트의 종료 핸들러 호출
      onEndMeeting();
    } catch (error) {
      console.error("회의 종료 중 오류 발생:", error);
    }
  };

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = useCallback(() => {
    if (noteContentRef.current) {
      noteContentRef.current.scrollTop = noteContentRef.current.scrollHeight;
    }
  }, []);

  // accumulatedMessages가 업데이트될 때마다 스크롤 이동
  useEffect(() => {
    scrollToBottom();
  }, [accumulatedMessages, scrollToBottom]);

  return (
    <NoteContainer>
      <NoteContent ref={noteContentRef}>
        {accumulatedMessages.length > 0 ? (
          accumulatedMessages.map((message, index) => {
            switch(message.type) {
              case "divider":
                return <AgendaDivider key={index} />;
              case "agenda_change":
                return (
                  <AgendaHeader key={index}>
                    {message.message}
                  </AgendaHeader>
                );
              case "plain":
                return (
                  <TextMessage key={index} type="plain">
                    {message.message}
                  </TextMessage>
                );
                case "query":
                  return (
                    <TextMessage key={index} type="query">
                      {/* {(message.message || []).map((msg, i) => (
                        <div key={i}>
                          {msg.startsWith('질문 :') ? msg : `질문 : ${msg}`}
                        </div>
                      ))} */}
                      <div>{message.message}</div>
                    </TextMessage>
                  );
                case "agenda_docs_update":
                  return (
                    <TextMessage key={index} type="agenda_docs_update">
                      {message.message || ""}
                      {message.documents && (
                        <DocumentList>
                          {message.documents.map((doc, docIndex) => (
                            <DocumentLink key={docIndex}>
                              관련 문서 #{docIndex + 1}
                              {doc.title}
                              {doc.content}
                            </DocumentLink>
                          ))}
                        </DocumentList>
                      )}
                    </TextMessage>
                  );
              default:
                return null;
            }
          })
        ) : (
          <p>아직 기록된 내용이 없습니다.</p>
        )}
      </NoteContent>

      <ButtonContainer>
        <ButtonGroup>
          {meetingInfo?.meeting_agendas?.length > currentAgendaNum && (
            <NextButton onClick={handleNextAgenda}>
              다음 안건
            </NextButton>
          )}
          <EndButton onClick={handleEndMeeting}>
            회의 종료
          </EndButton>
        </ButtonGroup>
      </ButtonContainer>
    </NoteContainer>
  );
};

export default RealtimeNote;
