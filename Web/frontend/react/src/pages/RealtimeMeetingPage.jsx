import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import RealtimeNote from "../components/RealtimeNote"; // 변경된 STT 페이지
import RealtimeDoc from "../components/RealtimeDoc"; // 변경된 RAG 문서 페이지
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // 페이지 이동을 위한 useNavigate
import { useSelector } from "react-redux";
import axiosInstance from '../api/axiosInstance';  // axiosInstance import

// 모달 스타일 설정
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const MeetingPageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f6f8;
  gap: 20px;
  padding: 20px;
  max-width: 1800px;  // 전체 너비 증가
  margin: 0 auto;     // 중앙 정렬
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 10px;
  padding: 15px;      // 패딩 감소
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  min-width: 800px;   // 최소 너비 설정
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  min-width: 800px;   // 최소 너비 설정
`;

const Button = styled.button`
  background-color: #274c77;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1b3a57;
  }
`;

// Styled components for meeting info
const MeetingInfoContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const InfoRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  min-width: 200px;
`;

const Label = styled.span`
  font-weight: 600;
  color: #495057;
  min-width: 70px;
  font-size: 0.9rem;
`;

const Content = styled.span`
  color: #212529;
  font-size: 0.9rem;
`;

const AgendaList = styled.div`
  margin-top: 5px;
  color: #212529;
  font-size: 0.9rem;
  
  span {
    background-color: #e9ecef;
    padding: 2px 8px;
    border-radius: 4px;
    margin-right: 8px;
    display: inline-block;
    margin-bottom: 4px;
  }
`;

const ParticipantTag = styled.span`
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

const AgendaItem = styled.div`
  background-color: #e9ecef;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 4px;
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
`;

const MessageContainer = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &.plain {
    background-color: white;
  }
  
  &.query {
    background-color: #e3f2fd;
    border-left: 4px solid #2196f3;
  }
  
  &.rag {
    background-color: #f3e5f5;
    border-left: 4px solid #9c27b0;
  }
`;

const RealtimeMeetingPage = () => {
  const API_BASE_URL = import.meta.env.VITE_APP_BASEURL;
  const { meetingId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [meetingData, setMeetingData] = useState(null);
  const [error, setError] = useState(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isReady, setIsReady] = useState(false);  // 회의 준비 완료 상태
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showMeetingScreen, setShowMeetingScreen] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [currentAgendaNum, setCurrentAgendaNum] = useState(1);
  const navigate = useNavigate();
  const [eventSource, setEventSource] = useState(null);
  const [sttText, setSttText] = useState([]);
  const [queryMessage, setQueryMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  console.log("Current meeting ID:", meetingId);
  console.log("API BASE URL:", API_BASE_URL); // 환경변수 확인용 로그

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const response = await axiosInstance.get(`/meetingroom/booked/${meetingId}/`);
        setMeetingData(response.data);
        setMeetingInfo(response.data);
      } catch (error) {
        console.error("회의 정보 로드 중 오류:", error);
        setError("회의 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchMeetingData();
  }, [meetingId]);

  // meetingInfo가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log("현재 meetingInfo:", meetingInfo);
  }, [meetingInfo]);

  // SSE 연결 설정
  const setupSSE = useCallback(() => {
    const sse = new EventSource(`${process.env.REACT_APP_API_URL}/meetings/stream/${meetingId}/`);
    
    sse.onopen = () => {
      console.log('SSE 연결 성공');
    };

    // 일반 메시지 수신
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('수신된 데이터:', data);
        
        // 메시지 타입에 따른 처리
        const messageObj = {
          type: data.type || 'plain',
          message: data.message
        };

        setSttText(prev => [...prev, messageObj]);

        // documents 처리
        if (data.type === 'agenda_docs_update' && data.documents) {
          setDocuments(prev => {
            const newDocs = data.documents.filter(doc => !prev.includes(doc));
            return [...prev, ...newDocs];
          });
        }

        if (data.cur_agenda_num) {
          setCurrentAgendaNum(data.cur_agenda_num);
        }
      } catch (error) {
        console.error('메시지 처리 오류:', error);
      }
    };

    sse.onerror = (error) => {
      console.error('SSE 연결 에러:', error);
      sse.close();
      setEventSource(null);
    };

    setEventSource(sse);
  }, [meetingId]);

  // 회의 준비 처리
  const handlePrepareMeeting = async () => {
    console.log("회의 준비 시작");
    setIsPreparing(true);
    setError(null);

    try {
      // 1. 회의 준비 요청
      const prepareResponse = await axiosInstance.post('/meetings/prepare/', {
        meeting_id: meetingId,
        agenda_id: meetingData?.meeting_agendas[0]?.id,
        agenda_title: meetingData?.meeting_agendas[0]?.title
      });

      // 2. 스케줄러 요청 (경로 수정)
      const schedulerResponse = await axiosInstance.get(`/meetings/scheduler/${meetingId}/`);

      console.log("회의 준비 응답:", prepareResponse.data);
      console.log("스케줄러 응답:", schedulerResponse.data);

      if (prepareResponse.status === 200 && schedulerResponse.status === 200) {
        console.log("회의 준비 완료");
        setIsReady(true);
      } else {
        setError("회의 준비 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("회의 준비 중 오류 발생:", error);
      console.error("에러 상세 정보:", error.response?.data);
      setError(error.message || "서버와 연결할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setIsPreparing(false);
    }
  };

  // 회의 시작 처리
  const handleStartMeeting = async () => {
    if (!meetingData) {
      setError("회의 정보가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const firstAgenda = meetingData.meeting_agendas[0];
      const requestData = {
        meeting_id: parseInt(meetingId),  // 문자열을 숫자로 변환
        agenda_id: firstAgenda?.id ? parseInt(firstAgenda.id) : null,  // null 처리 추가
        agenda_title: firstAgenda?.title || null  // null 처리 추가
      };

      console.log("회의 시작 요청 데이터:", requestData);
      
      const response = await axiosInstance.post('/meetings/start/', requestData);

      console.log("회의 시작 응답:", response.data);

      if (response.status === 200) {
        if (response.data.status === 'error' && response.data.message === 'Meeting is already in progress.') {
          setIsMeetingStarted(true);
          setIsModalOpen(false);
        } else {
          setIsMeetingStarted(true);
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error("회의 시작 중 오류:", error);
      console.error("요청 데이터:", error.config?.data);
      console.error("서버 응답:", error.response?.data);
      console.error("에러 상태 코드:", error.response?.status);
      
      if (error.response?.data?.message === 'Meeting is already in progress.') {
        setIsMeetingStarted(true);
        setIsModalOpen(false);
      } else {
        setError(error.response?.data?.message || "회의 시작에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  // 메시지 렌더링
  const renderMessages = () => {
    return sttText.map((item, index) => (
      <MessageContainer 
        key={index} 
        className={item.type}
      >
        {item.message}
      </MessageContainer>
    ));
  };

  const containerStyle = {
    display: 'flex',
    height: '100vh',
  };

  const leftPanelStyle = {
    flex: '0 0 50%',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const rightPanelStyle = {
    flex: '0 0 50%',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const infoContainerStyle = {
    marginBottom: '15px',
    fontSize: '13px',
    lineHeight: '1.2',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#555',
  };

  // 반응형 스타일
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  if (mediaQuery.matches) {
    rightPanelStyle.display = 'none'; // 화면이 줄어들면 오른쪽 패널 숨김
  }

  // RealtimeNote로부터 회의 정보를 받아오는 콜백 함수
  const handleMeetingInfo = (info) => {
    console.log('안건 데이터 구조:', JSON.stringify(info.meeting_agendas, null, 2));
    setMeetingInfo(info);
  };

  return (
    <MeetingPageContainer>
      {isMeetingStarted ? (
        <>
          <LeftPanel>
            {meetingInfo && (
              <MeetingInfoContainer>
                <InfoRow>
                  <InfoItem>
                    <Label>회의명</Label>
                    <Content>{meetingInfo.title}</Content>
                  </InfoItem>
                  <InfoItem>
                    <Label>프로젝트</Label>
                    <Content>{meetingInfo.project.name}</Content>
                  </InfoItem>
                </InfoRow>
                <InfoRow>
                  <InfoItem>
                    <Label>시간</Label>
                    <Content>
                      {meetingInfo.starttime.split(' ')[1]} ~ {meetingInfo.endtime.split(' ')[1]}
                    </Content>
                  </InfoItem>
                  <InfoItem>
                    <Label>주최자</Label>
                    <Content>{meetingInfo.booker}</Content>
                  </InfoItem>
                </InfoRow>
                <InfoRow>
                  <InfoItem>
                    <Label>참가자</Label>
                    <Content>
                      {meetingInfo.meeting_participants[0]?.name || meetingInfo.booker}
                    </Content>
                  </InfoItem>
                </InfoRow>
                <InfoRow>
                  <InfoItem style={{ width: '100%' }}>
                    <Label>안건</Label>
                    <AgendaList>
                      {meetingInfo.meeting_agendas?.map((agenda, index) => (
                        <span key={agenda.id}>
                          {index + 1}. {agenda.title}
                        </span>
                      ))}
                    </AgendaList>
                  </InfoItem>
                </InfoRow>
              </MeetingInfoContainer>
            )}
            <RealtimeNote 
              meetingInfo={meetingInfo} 
              currentAgendaNum={currentAgendaNum}
            />
          </LeftPanel>
          <RightPanel>
            <RealtimeDoc />
          </RightPanel>
        </>
      ) : (
        <ModalBackground>
          <ModalContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            {isPreparing ? (
              <h3>회의 준비 중...</h3>
            ) : !isReady ? (
              <>
                <h3>회의를 준비하시겠습니까?</h3>
                <Button onClick={handlePrepareMeeting}>회의 준비</Button>
              </>
            ) : (
              <>
                <h3>회의를 시작하시겠습니까?</h3>
                <Button onClick={handleStartMeeting}>회의 시작</Button>
              </>
            )}
          </ModalContainer>
        </ModalBackground>
      )}
      <div className="messages">
        {renderMessages()}
      </div>
    </MeetingPageContainer>
  );
};

export default RealtimeMeetingPage;