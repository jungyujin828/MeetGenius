import React from 'react';
import styled from 'styled-components';

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  height: 50px;
  background-color: ${(props) => (props.hasMeeting ? "#ffedcc" : "white")};
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  height: 500px;
`;

const MeetingRoomBooked = ({ meetings }) => {
  const weekDays = ["월", "화", "수", "목", "금"];
  const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 09:00 ~ 18:00

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
        {hours.map((hour) => (
          <tr key={hour}>
            <Td>{hour}:00</Td>
            {weekDays.map((_, index) => {
              // 각 회의의 starttime과 endtime을 비교하여 해당 시간에 예약이 있는지 확인
              const meeting = meetings.find((m) => {
                const meetingStart = new Date(m.starttime);
                const meetingEnd = new Date(m.endtime);
                const meetingDay = meetingStart.getDay();
                const meetingHourStart = meetingStart.getHours();
                const meetingHourEnd = meetingEnd.getHours();

                // 시작 시간이 해당 시간대에 포함되거나, 종료 시간이 해당 시간대에 포함되면 해당 셀을 예약 상태로 설정
                return (
                  meetingDay === index && 
                  ((meetingHourStart <= hour && meetingHourEnd > hour) || 
                  (meetingHourStart === hour && meetingHourEnd > hour) ||
                  (meetingHourStart < hour && meetingHourEnd >= hour))
                );
              });

              return (
                <Td key={index} hasMeeting={!!meeting}>
                  {meeting ? (
                    <>
                      <strong>{meeting.title}</strong> <br />
                    </>
                  ) : null}
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
