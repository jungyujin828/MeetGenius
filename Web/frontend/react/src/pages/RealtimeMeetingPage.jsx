import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import RealtimeNote from "../components/RealtimeNote"; // 변경된 STT 페이지
import RealtimeDoc from "../components/RealtimeDoc"; // 변경된 RAG 문서 페이지
import { useNavigate, useParams } from "react-router-dom"; // 페이지 이동을 위한 useNavigate
import axiosInstance from '../api/axiosInstance';  // axiosInstance import
import useSSE from "../hooks/useSSE"; // ✅ SSE 훅 가져오기
import { fetchMeetingDetails } from "../api/meetingRoom";
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
  const { meetingId } = useParams();
  const { data } = useSSE(meetingId);
  const [error, setError] = useState(null); // 🔹 에러 상태 추가

  const [isReady, setIsReady] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);


  const [meetingInfo, setMeetingInfo] = useState(null);
  const [currentAgendaNum, setCurrentAgendaNum] = useState(1);
  const navigate = useNavigate();
  const [eventSource, setEventSource] = useState(null);
  const [sttText, setSttText] = useState([]);
  const [documents, setDocuments] = useState([]);

  console.log("Current meeting ID:", meetingId);

  const handleDocumentUpdate = (newDocuments) => {
    console.log("📂 새로운 문서 업데이트 (부모에서 관리):", newDocuments);
    setDocuments(newDocuments);
  };

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const meetingInfo = await fetchMeetingDetails(meetingId);
        setMeetingInfo(meetingInfo);
      } catch (error) {
        console.error("회의 정보 로드 중 오류:", error);
        setError("회의 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchMeetingData();
  }, [meetingId]);
  useEffect(() => {
    console.log("현재 meetingInfo:", meetingInfo);
  }, [meetingInfo]);


  // 페이지 로드 시 SSE 연결만 수행
  useEffect(() => {
    if (!data) return;

    console.log("🎯 SSE 데이터 감지:", data);

    if (data.meeting_state) {
        console.log("회의 상태 변경:", data.meeting_state);

        switch (data.meeting_state) {
            case "waiting_for_start":
                setIsReady(true);
                setIsPreparing(false);
                break;
            case "meeting_in_progress":
                setIsMeetingStarted(true);
                break;
            case "meeting_finished":
                alert("회의가 종료되었습니다.");
                navigate("/dashboard");
                break;
            default:
                console.warn("알 수 없는 상태:", data.meeting_state);
        }
    }
}, [data, navigate]);

  // 회의 준비 버튼 클릭 시에만 스케줄러 실행
  const handlePrepareMeeting = async () => {
    console.log("회의 준비 시작");
    setIsPreparing(true);
    setError(null);

    try {
      // 1. 스케줄러 실행 (회의 준비 버튼 클릭 시에만!)
      const schedulerResponse = await axiosInstance.get(`/meetings/scheduler/${meetingId}/`);
      
      if (schedulerResponse.status === 200) {
        // 2. 회의 준비 요청
        const prepareResponse = await axiosInstance.post('/meetings/prepare/', {
          meeting_id: meetingId,
          agenda_id: meetingInfo?.meeting_agendas[0]?.id,
          agenda_title: meetingInfo?.meeting_agendas[0]?.title
        });

        if (prepareResponse.status === 200) {
          console.log("회의 준비 완료");
          // 서버가 SSE를 통해 'waiting_for_start' 상태를 보내줄 것임
        }
      }
    } catch (error) {
      console.error("회의 준비 중 오류 발생:", error);
      setError(error.message || "서버와 연결할 수 없습니다. 다시 시도해 주세요.");
      setIsPreparing(false);
    }
  };

  // 회의 시작 처리
  const handleStartMeeting = async () => {
    if (!meetingInfo) {
      setError("회의 정보가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const firstAgenda = meetingInfo.meeting_agendas[0];
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
    console.log('안건 데이터 구조:', JSON.stringify(info.meeting_agendas, null, 1));
    setMeetingInfo(info);
  };

  const handleEndMeeting = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('[회의 종료] 토큰 확인:', token); // 토큰 값 확인

      const config = {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      };

      console.log('[회의 종료] 요청 설정:', {
        url: '/meetings/stop/',
        data: { meeting_id: meetingId },
        headers: config.headers
      });

      const response = await axiosInstance.post('/meetings/stop/', {
        meeting_id: meetingId
      }, config);

      console.log('[회의 종료] 응답:', response.data);

      // EventSource 연결 종료
      if (eventSource) {
        eventSource.close();
      }

      // 로컬 스토리지 데이터 정리
      localStorage.removeItem(`meeting_${meetingId}_stt`);
      
      alert('회의가 종료되었습니다.');
      // 대시보드로 이동
      navigate('/dashboard');
      
    } catch (error) {
      console.error('[회의 종료] 에러 상세:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.config?.headers,
        url: error.config?.url,
        token: localStorage.getItem('authToken')
      });
      alert('회의 종료 중 오류가 발생했습니다.');
    }
  };

  // 회의 상태에 따른 화면 렌더링
  const renderMeetingStateScreen = () => {
    if (isPreparing) {
      return (
        <ModalBackground>
          <ModalContainer>
            <h3>회의 준비 중...</h3>
          </ModalContainer>
        </ModalBackground>
      );
    }

    if (isReady && !isMeetingStarted) {
      return (
        <ModalBackground>
          <ModalContainer>
            <h3>회의를 시작하시겠습니까?</h3>
            <Button onClick={handleStartMeeting}>회의 시작</Button>
          </ModalContainer>
        </ModalBackground>
      );
    }

    if (!isMeetingStarted) {
      return (
        <ModalBackground>
          <ModalContainer>
            <h3>회의 준비가 필요합니다</h3>
            <Button onClick={handlePrepareMeeting}>회의 준비</Button>
          </ModalContainer>
        </ModalBackground>
      );
    }

    return (
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
            onEndMeeting={handleEndMeeting}
            onDocumentUpdate={handleDocumentUpdate}
          />
        </LeftPanel>
        <RightPanel>
          <RealtimeDoc meetingInfo={meetingInfo} documents={documents} />
        </RightPanel>
      </>
    );
  };

  return (
    <MeetingPageContainer>
      {renderMeetingStateScreen()}
      <div className="messages">
        {renderMessages()}
      </div>
    </MeetingPageContainer>
  );
};

export default RealtimeMeetingPage;