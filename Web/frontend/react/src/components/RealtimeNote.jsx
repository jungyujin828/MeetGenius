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
    border-left: 2px solid #1864ab;
    
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

const AgendaHeader = styled.h2`
  font-size: 24px;
  color: #1a73e8;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a73e8;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

const BaseButton = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const NextButton = styled(BaseButton)`
  background-color: #1a73e8;
  color: white;
  border: none;

  &:hover {
    background-color: #1557b0;
  }
`;

const EndButton = styled(BaseButton)`
  background-color: #dc3545;
  color: white;
  border: none;

  &:hover {
    background-color: #bb2d3b;
  }
`;

const DocumentList = styled.div`
  margin-top: 8px;
`;

const RealtimeNote = ({ meetingInfo, currentAgendaNum }) => {
  const { meetingId } = useParams();
  const [sttText, setSttText] = useState([]);
  const [queryMessage, setQueryMessage] = useState(""); // 쿼리 메시지
  const [documents, setDocuments] = useState([]); // RAG 문서 목록
  const [meetingState, setMeetingState] = useState(""); // 회의 상태
  const [ragList, setRagList] = useState([]); // 새로운 RAG 문서 목록
  const [error, setError] = useState(null);
  const [currentAgenda, setCurrentAgenda] = useState(null);
  const [groupedMessages, setGroupedMessages] = useState([]);

  // SSE 메시지 수신 처리
  useEffect(() => {
    const baseUrl = axiosInstance.defaults.baseURL;
    const eventSource = new EventSource(`${baseUrl}/meetings/stream/`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE] 받은 데이터:', data);

        // 초기 데이터 처리 (Redis에 저장된 기존 데이터)
        if (data.stt_list) {
          console.log('[SSE] 초기 STT 리스트 설정:', data.stt_list);
          setSttText(data.stt_list);
          return;
        }

        // 실시간 메시지 처리
        if (data.type && data.message) {
          const messageWithTimestamp = {
            ...data,
            timestamp: new Date().toISOString()
          };

          setSttText(prevMessages => {
            const newMessages = [...prevMessages, messageWithTimestamp];
            const sortedMessages = newMessages.sort((a, b) => 
              new Date(a.timestamp) - new Date(b.timestamp)
            );
            
            console.log('[SSE] 업데이트된 메시지 목록:', sortedMessages);
            localStorage.setItem(`meeting_${meetingId}_stt`, JSON.stringify(sortedMessages));
            
            return sortedMessages;
          });
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
    const savedSTT = localStorage.getItem(`meeting_${meetingId}_stt`);
    if (savedSTT) {
      try {
        const parsedSTT = JSON.parse(savedSTT);
        console.log('[LocalStorage] 저장된 데이터 복원:', parsedSTT);
        setSttText(parsedSTT);
      } catch (error) {
        console.error('[LocalStorage] 데이터 복원 중 에러:', error);
      }
    }

    return () => eventSource.close();
  }, [meetingId]);

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
      const agenda = meetingInfo.meeting_agendas.find(a => a.order === currentAgendaNum);
      setCurrentAgenda(agenda);
    }
  }, [meetingInfo, currentAgendaNum]);

  // 다음 안건으로 이동
  const handleNextAgenda = async () => {
    try {
      const response = await axiosInstance.post('meetings/agenda/next_agenda/');
      console.log("다음 안건 응답:", response.data);
      // 상위 컴포넌트에서 currentAgendaNum 업데이트
    } catch (error) {
      console.error("다음 안건 이동 중 오류:", error);
    }
  };

  // sttText 상태가 변경될 때마다 로그
  useEffect(() => {
    console.log('[State] 현재 STT 텍스트 상태:', sttText);
  }, [sttText]);

  // 메시지 그룹화 처리
  useEffect(() => {
    if (sttText.length > 0) {
      setGroupedMessages(groupMessages(sttText));
    }
  }, [sttText, groupMessages]);

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
      {currentAgenda && (
        <AgendaHeader>
          안건 {currentAgendaNum}: {currentAgenda.title}
        </AgendaHeader>
      )}
      
      <Panel>
        <LeftPanel>
          {groupedMessages.length > 0 ? (
            groupedMessages.map((group, index) => {
              switch(group.type) {
                case "plain":
                  return (
                    <TextMessage key={index} type="plain">
                      {group.messages.join('\n')}
                    </TextMessage>
                  );
                case "query":
                  return (
                    <TextMessage key={index} type="query">
                      {group.messages.map((msg, i) => (
                        <div key={i}>
                          {msg.startsWith('질문 :') ? msg : `질문 : ${msg}`}
                        </div>
                      ))}
                    </TextMessage>
                  );
                case "agenda_docs_update":
                  return (
                    <TextMessage key={index} type="agenda_docs_update">
                      {group.messages[0]}
                      {group.documents && (
                        <DocumentList>
                          {group.documents.map((doc, docIndex) => (
                            <DocumentLink key={docIndex}>
                              관련 문서 #{docIndex + 1}
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
        </LeftPanel>
      </Panel>

      <ButtonContainer>
        {meetingInfo?.meeting_agendas?.length === currentAgendaNum ? (
          <EndButton onClick={handleEndMeeting}>
            회의 종료
          </EndButton>
        ) : (
          <NextButton onClick={handleNextAgenda}>
            다음 안건으로
          </NextButton>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default RealtimeNote;
