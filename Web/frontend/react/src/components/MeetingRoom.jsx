import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addMeeting, setMeetings } from "../redux/meetingSlice"; // 리덕스 액션 import
import MeetingRoomCreateWidget from "./MeetingRoomCreateWidget";
import MeetingRoomListWidget from "./MeetingRoomListWidget";
import MeetingRoomDetailWidget from "./MeetingRoomDetailWidget";

// ✅ 컨테이너 스타일 (깔끔한 중앙 정렬)
const MeetingRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

// ✅ 회의실 선택 버튼 스타일
const RoomSelectContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
`;
const RoomButton = styled.button`
  background-color: ${(props) => (props.active ? "#1b3a57" : "transparent")};  // ✅ 선택된 경우만 색상 변경
  color: ${(props) => (props.active ? "white" : "#274c77")};  // ✅ 선택되지 않으면 글자색 유지
  padding: 12px 18px;
  border: 2px solid ${(props) => (props.active ? "#1b3a57" : "#274c77")}; // ✅ 선택되지 않은 경우 경계선 유지
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#1b3a57" : "#f0f0f0")}; // ✅ 선택되지 않은 버튼은 hover 시 연한 색상
  }
`;

// ✅ 메인 컨텐츠 박스 (회의 목록 + 상세보기/예약)
const ContentWrapper = styled.div`
  display: flex;
  gap: 25px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`;

// ✅ 회의 목록 컨테이너
const MeetingListContainer = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

// ✅ 예약 및 상세보기 컨테이너
const SidePanel = styled.div`
  flex: 0 0 350px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const BookingButton = styled.button`
  background-color: #1b3a57;  // ✅ 회의실 버튼과 조화로운 색상
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  font-weight: bold;
  margin-bottom: 10px;
  letter-spacing: 0.5px;  // ✅ 텍스트 가독성 향상
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #274c77;  // ✅ hover 시 색상 변경
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);  // ✅ 부드러운 그림자 추가
  }

  &:active {
    transform: scale(0.95);  // ✅ 클릭 시 약간 작아지는 효과
  }
`;


const MeetingRoom = () => {
  const dispatch = useDispatch();
  const meetings = useSelector((state) => state.meetings); // 리덕스에서 meetings 상태 가져오기
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [isBookingVisible, setIsBookingVisible] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  // ✅ 회의실 선택 함수
  const handleSelectRoom = (roomId) => {
    setSelectedRoom(roomId);
    setIsBookingVisible(false);
    setSelectedMeetingId(null);
  };

  // ✅ 회의 상세보기 클릭
  const handleMeetingClick = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setIsBookingVisible(false);
  };

  // ✅ 예약 폼만 토글 (버튼은 항상 보이게 유지)
  const handleToggleBooking = () => {
    setSelectedMeetingId(null);
    setIsBookingVisible((prev) => !prev);
  };

  return (
    <MeetingRoomContainer>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>회의실 예약 시스템</h2>

      <RoomSelectContainer>
  {[1, 2].map((roomId) => (
    <RoomButton
      key={roomId}
      active={selectedRoom === roomId}
      onClick={() => handleSelectRoom(roomId)}
      >
      {selectedRoom === roomId && "✔️ "}회의실 {roomId}
    </RoomButton>
  ))}
  {/* My Meetings 버튼 추가 */}
  <RoomButton
    key="mymeetings"
    active={selectedRoom === 0}
    onClick={() => handleSelectRoom(0)}
  >
    {selectedRoom === 0 && "✔️ "}My Meetings
  </RoomButton>
</RoomSelectContainer>



      {/* ✅ 메인 컨텐츠 */}
      <ContentWrapper>
        {/* ✅ 회의 목록 */}
        <MeetingListContainer>
          <MeetingRoomListWidget
            meetings={meetings}
            roomId={selectedRoom}
            onMeetingClick={handleMeetingClick}
          />
        </MeetingListContainer>

        {/* ✅ 예약 및 상세보기 패널 */}
        <SidePanel>
          {/* ✅ 예약 버튼 (회의실이 선택된 경우만 보이도록 설정) */}
          {selectedRoom !== 0 && (
            <BookingButton onClick={handleToggleBooking}>예약하기</BookingButton>
          )}


          {/* ✅ 회의 상세 보기 OR 예약 폼 */}
          {selectedMeetingId ? (
            <MeetingRoomDetailWidget meetingId={selectedMeetingId} onClose={() => setSelectedMeetingId(null)} />
          ) : (
            <>
              {/* ✅ 예약 폼은 토글 */}
              {isBookingVisible && <MeetingRoomCreateWidget roomId={selectedRoom} />}
              </>
          )}
        </SidePanel>
      </ContentWrapper>
    </MeetingRoomContainer>
  );
};

export default MeetingRoom;
