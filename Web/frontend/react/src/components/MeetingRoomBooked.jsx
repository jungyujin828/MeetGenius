import React from "react";
import styled from "styled-components";

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  height: 30px;
  background-color: ${(props) => (props.hasMeeting ? "#ffedcc" : "white")};
  cursor: ${(props) => (props.hasMeeting ? "pointer" : "default")};
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  height: 600px;
`;

const MeetingRoomBooked = ({ meetings, onMeetingClick }) => {

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
            <th key={index}>{day}</th>
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
