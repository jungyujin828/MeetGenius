import React, { useState, useEffect } from "react";
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
  padding: 20px;
`;

const LeftPanel = styled.div`
  width: 50%;
  border-right: 2px solid #ccc;
  padding: 10px;
`;

const RightPanel = styled.div`
  width: 50%;
  padding: 10px;
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
const MeetingInfoSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-weight: bold;
  color: #495057;
  margin-bottom: 4px;
`;

const Content = styled.div`
  color: #212529;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

const RealtimeMeetingPage = () => {
  const API_BASE_URL = import.meta.env.VITE_APP_BASEURL;
  const { meetingId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [meetingData, setMeetingData] = useState(null);
  const [error, setError] = useState(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showMeetingScreen, setShowMeetingScreen] = useState(false);
  // 회의 정보 상태 추가
  const [meetingInfo, setMeetingInfo] = useState({
    title: "",
    starttime: "",
    endtime: "",
    meeting_participants: [],
    meeting_agendas: [],
    project: {
      name: "",
      description: "",
      department: "",
    }
  });
  const [currentAgenda, setCurrentAgenda] = useState(null);
  const navigate = useNavigate();

  console.log("Current meeting ID:", meetingId);
  console.log("API BASE URL:", API_BASE_URL); // 환경변수 확인용 로그

  const fetchMeetingData = async () => {
    try {
      const url = `/meetingroom/booked/${meetingId}/`;  // baseURL은 axiosInstance에 이미 설정되어 있음
      console.log("API 요청 URL:", url);
      
      const response = await axiosInstance.get(url);
      
      console.log("서버 응답 전체:", response);
      console.log("서버 응답 데이터:", response.data);
      
      // 응답 데이터의 id가 URL의 meetingId와 일치하는지 확인
      if (response.data.id !== parseInt(meetingId)) {
        console.error(`잘못된 회의 데이터가 로드됨. 요청한 ID: ${meetingId}, 받은 ID: ${response.data.id}`);
        throw new Error("잘못된 회의 정보가 로드되었습니다.");
      }
      
      setMeetingData(response.data);
    } catch (error) {
      console.error("회의 정보 로드 중 오류 발생:", error);
      console.error("에러 상세 정보:", error.response?.data);
      setError("회의 정보를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchMeetingData();
  }, [meetingId]);  // token 의존성 제거 (axiosInstance가 처리)

  const handlePrepareMeeting = async () => {
    console.log("회의 준비 시작");
    console.log("현재 meetingData:", meetingData);
    setIsPreparing(true);
    setError(null);

    try {
      if (!meetingData) {
        throw new Error("회의 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      }

      console.log("meeting_agendas:", meetingData.meeting_agendas);
      
      if (!Array.isArray(meetingData.meeting_agendas) || meetingData.meeting_agendas.length === 0) {
        throw new Error("진행할 안건이 없습니다.");
      }

      const firstAgenda = meetingData.meeting_agendas[0];
      console.log("선택된 첫 번째 안건:", firstAgenda);
      
      // axiosInstance 사용
      const response = await axiosInstance.post('/meetings/start/', {
        meeting_id: meetingId,
        agenda_id: firstAgenda.id,
        agenda_title: firstAgenda.title
      });

      if (response.status === 200) {
        console.log("회의 준비 완료");
        setIsMeetingStarted(true);
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
  
  const handleStartMeeting = async () => {
    console.log("회의 시작 요청");
    try {
      // axiosInstance 사용
      const response = await axiosInstance.post("/meetings/start/");
      
      if (response.status === 200) {
        setIsMeetingStarted(true);
        setShowMeetingScreen(true);
      }
    } catch (error) {
      console.error("회의 시작 중 오류:", error);
      setError("회의 시작에 실패했습니다.");
    }
  };

  return (
    <MeetingPageContainer>
      <LeftPanel>
        <RealtimeNote />
      </LeftPanel>
      <RightPanel>
        <RealtimeDoc />
      </RightPanel>
      
      {/* 에러 메시지 표시 */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {/* 회의 준비 중 모달 */}
      {isPreparing && (
        <ModalBackground>
          <ModalContainer>
            <h3>회의 준비 중...</h3>
            <p>잠시만 기다려주세요.</p>
          </ModalContainer>
        </ModalBackground>
      )}
      
      {/* 회의 시작 전 모달 */}
      {isModalOpen && !isMeetingStarted && (
        <ModalBackground>
          <ModalContainer>
            <h3>회의를 시작하시겠습니까?</h3>
            <Button onClick={handlePrepareMeeting}>회의 시작</Button>
          </ModalContainer>
        </ModalBackground>
      )}
    </MeetingPageContainer>
  );
};

export default RealtimeMeetingPage;