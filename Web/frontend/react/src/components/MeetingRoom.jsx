import React, { useState } from "react";
import styled from "styled-components";
import MeetingRoomCreateWidget from "./MeetingRoomCreateWidget";
import MeetingRoomListWidget from "./MeetingRoomListWidget";

// ✅ 회의실 예약 컨테이너 스타일
const MeetingRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

// ✅ 회의실 버튼 스타일
const RoomSelectContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

const RoomButton = styled.button`
  background-color: ${(props) => (props.active ? "#1b3a57" : "#274c77")};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1b3a57;
  }
`;

const MeetingRoom = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ✅ 새로운 회의 생성 함수
  const handleCreateMeeting = (newMeeting) => {
    setMeetings([...meetings, newMeeting]);
  };

  // ✅ 회의실 선택 함수
  const handleSelectRoom = (roomId) => {
    setSelectedRoom(roomId);
  };

  return (
    <MeetingRoomContainer>
      {/* ✅ 회의실 선택 버튼 */}
      <RoomSelectContainer>
        {[1, 2, 3, 4, 5].map((roomId) => (
          <RoomButton
            key={roomId}
            active={selectedRoom === roomId}
            onClick={() => handleSelectRoom(roomId)}
          >
            회의실 {roomId}
          </RoomButton>
        ))}
      </RoomSelectContainer>

      {/* ✅ 회의 생성 컴포넌트 */}
      <MeetingRoomCreateWidget onCreate={handleCreateMeeting} />

      {/* ✅ 선택된 회의실 ID를 전달 */}
      {selectedRoom && <MeetingRoomListWidget meetings={meetings} roomId={selectedRoom} />}
    </MeetingRoomContainer>
  );
};

export default MeetingRoom;
