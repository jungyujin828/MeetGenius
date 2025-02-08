// MeetingRoom.jsx

import React from "react";
import styled from "styled-components";

// ✅ 회의실 예약 컨테이너 스타일
const MeetingRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

// ✅ 회의실 예약 폼 스타일
const ReservationForm = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

// ✅ 버튼 스타일
const Button = styled.button`
  background-color: #274c77;
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
  return (
    <MeetingRoomContainer>
      <h2>회의실 예약</h2>
      <ReservationForm>
        <h3>회의실 예약 폼</h3>
        {/* 예약 폼 내용 - 예시 */}
        <div>
          <label>회의실 선택:</label>
          <select>
            <option>회의실 A</option>
            <option>회의실 B</option>
          </select>
        </div>
        <div>
          <label>날짜 및 시간:</label>
          <input type="datetime-local" />
        </div>
        <Button>예약하기</Button>
      </ReservationForm>
    </MeetingRoomContainer>
  );
};

export default MeetingRoom;
