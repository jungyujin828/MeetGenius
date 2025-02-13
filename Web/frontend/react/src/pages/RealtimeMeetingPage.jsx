import React, { useState } from "react";
import styled from "styled-components";
import RealtimeNote from "../components/RealtimeNote"; // 변경된 STT 페이지
import RealtimeDoc from "../components/RealtimeDoc"; // 변경된 RAG 문서 페이지
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate

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

const RealtimeMeetingPage = () => {
  const [isPreparing, setIsPreparing] = useState(false); // 회의 준비 상태
  const [error, setError] = useState(null); // 오류 상태
  const [isMeetingStarted, setIsMeetingStarted] = useState(false); // 회의 시작 여부
  const [isModalOpen, setIsModalOpen] = useState(true); // 모달 열림 상태
  const navigate = useNavigate();

  // 회의 준비 버튼 클릭 시 호출되는 함수
  const handlePrepareMeeting = async () => {
    setIsPreparing(true);
    setError(null); // 이전 오류 초기화
  
    try {
      const authToken = localStorage.getItem("authToken");
      console.log("Auth Token:", authToken);  // 토큰이 제대로 저장되어 있는지 확인
      if (!authToken) {
        setError("로그인이 필요합니다.");
        return;
      }

  
      const response = await axios.post(
        "http://127.0.0.1:8000/meetings/prepare/",
        {}, // 필요한 데이터가 있으면 추가
        {
          headers: {
            Authorization: `Token ${authToken}`,
            'X-CSRFToken': csrfToken,  // CSRF 토큰 추가
          },
        }
      );
      
      if (response.status === 200) {
        setIsModalOpen(false); // 모달 닫기
        setIsMeetingStarted(true); // 회의 시작 버튼 활성화
      } else {
        setError("회의 준비 중 문제가 발생했습니다.");
      }
    } catch (error) {
      setError("서버와 연결할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setIsPreparing(false);
    }
  };
  

  // 회의 시작 버튼 클릭 시 호출되는 함수
  const handleStartMeeting = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("로그인이 필요합니다.");
        return;
      }
      
      // 회의 시작 요청
      const response = await axios.post(
        "http://127.0.0.1:8000/meetings/stt/start/",
        {},
        {
          headers: {
            Authorization: `Token ${authToken}`,
            'X-CSRFToken': csrfToken,  // CSRF 토큰 추가
          },
        }
      );
      if (response.status === 200) {
        // 회의 시작 후 STT와 RAG 활성화
        alert("회의가 시작되었습니다.");
      } else {
        setError("회의 시작에 실패했습니다.");
      }
    } catch (error) {
      setError("회의 시작 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {/* 회의 시작 모달 */}
      {isModalOpen && (
        <ModalBackground>
          <ModalContainer>
            <h2>회의 시작</h2>
            <p>회의를 시작하시겠습니까?</p>
            <Button onClick={handlePrepareMeeting}>
              {isPreparing ? "회의 준비 중..." : "회의 준비하기"}
            </Button>
          </ModalContainer>
        </ModalBackground>
      )}

      {/* 회의 화면 */}
      {!isModalOpen && isMeetingStarted && (
        <MeetingPageContainer>
          <LeftPanel>
            <RealtimeNote /> {/* 실시간 회의록 컴포넌트 */}
          </LeftPanel>
          <RightPanel>
            <RealtimeDoc /> {/* 실시간 문서 컴포넌트 */}
          </RightPanel>
        </MeetingPageContainer>
      )}

      {/* 회의 시작 버튼 */}
      {isMeetingStarted && !isModalOpen && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button onClick={handleStartMeeting}>회의 시작</Button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RealtimeMeetingPage;
