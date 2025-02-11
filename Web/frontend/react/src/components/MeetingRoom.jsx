import React, { useState } from "react";
import styled from "styled-components";
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
  background-color: ${(props) => (props.active ? "#1b3a57" : "#274c77")};
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background-color: #1b3a57;
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

// ✅ 예약 버튼 스타일 (항상 보이도록 수정)
const BookingButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  font-weight: bold;
  margin-bottom: 10px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const MeetingRoom = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(1);
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

      {/* ✅ 회의실 선택 버튼 */}
      <RoomSelectContainer>
        {[1, 2].map((roomId) => (
          <RoomButton
            key={roomId}
            active={selectedRoom === roomId}
            onClick={() => handleSelectRoom(roomId)}
          >
            회의실 {roomId}
          </RoomButton>
        ))}
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
          {/* ✅ 예약 버튼 (항상 보이게 유지) */}
          <BookingButton onClick={handleToggleBooking}>예약하기</BookingButton>

          {/* ✅ 회의 상세 보기 OR 예약 폼 */}
          {selectedMeetingId ? (
            <MeetingRoomDetailWidget meetingId={selectedMeetingId} onClose={() => setSelectedMeetingId(null)} />
          ) : (
            <>
              {/* ✅ 예약 폼은 토글 */}
              {isBookingVisible && <MeetingRoomCreateWidget roomId={selectedRoom} setMeetings={setMeetings} />}
            </>
          )}
        </SidePanel>
      </ContentWrapper>
    </MeetingRoomContainer>
  );
};

export default MeetingRoom;
