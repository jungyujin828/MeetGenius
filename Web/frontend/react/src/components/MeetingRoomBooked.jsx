import React from "react";
import styled from "styled-components";


const meetingColors = ["#DEF2FF",
  "#E7ECEF",
  "#FDF7E3",
  "#F8BB15",
  "#B0E0E6",
  "#CDEAFF", 
  "#D9D9D9",
  "#EFF8FF",];
// 🎨 meeting.id 기반으로 색상을 고정적으로 선택하는 함수
const getMeetingColor = (meetingId) => {
  if (!meetingId) return "white"; // ✅ 미팅이 없으면 기본 배경색 유지
  const hash = meetingId.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return meetingColors[hash % meetingColors.length]; // ✅ 색상 배열 길이로 나눈 나머지를 인덱스로 사용
};

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  height: 30px;
  background-color: ${(props) => getMeetingColor(props.meetingId)};
  cursor: ${(props) => (props.meetingId ? "pointer" : "default")};
`;


const Table = styled.table`
width: 100%;
table-layout: fixed;
height: 600px;
`;

const MeetingRoomBooked = ({ meetings, onMeetingClick, dates }) => {

  const weekDays = ["월", "화", "수", "목", "금"];
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>시간</th>
          {weekDays.map((day, index) => (
            <th key={index}>
            {day} <br />
            {dates[index].toISOString().split("T")[0]} {/* 날짜 표시 */}
          </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((time, timeIndex) => (
          <tr key={timeIndex}>
            <Td>{time}</Td>
            {weekDays.map((_, dayIndex) => {
              const meeting = meetings.find((m) => {
                const meetingStart = new Date(m.starttime);
                const meetingEnd = new Date(m.endtime);
                const meetingDay = meetingStart.getDay();
                const meetingHourStart = meetingStart.getHours();
                const meetingMinuteStart = meetingStart.getMinutes();
                const meetingHourEnd = meetingEnd.getHours();
                const meetingMinuteEnd = meetingEnd.getMinutes();

                const slotHour = parseInt(time.split(":")[0], 10);
                const slotMinute = parseInt(time.split(":")[1], 10);

                const slotTime = slotHour * 60 + slotMinute;
                const startTime = meetingHourStart * 60 + meetingMinuteStart;
                const endTime = meetingHourEnd * 60 + meetingMinuteEnd;

                return meetingDay - 1 === dayIndex && startTime <= slotTime && endTime > slotTime;
              });

              return (
                <Td
                  key={dayIndex}
                  meetingId={meeting?.id}
                  hasMeeting={!!meeting}
                  onClick={() => meeting && onMeetingClick(meeting.id)} // ✅ 회의 클릭 시 상세보기 실행
                >
                  {meeting ? <strong>{meeting.title}</strong> : null}
                </Td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MeetingRoomBooked;
