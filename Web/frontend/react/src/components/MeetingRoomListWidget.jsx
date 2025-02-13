import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import MeetingRoomBooked from "./MeetingRoomBooked"; // 컴포넌트 임포트

const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Table = styled.table`
  width: 90%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #274c77;
  color: white;
  padding: 10px;
  text-align: center;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  height: 50px;
  background-color: ${(props) => (props.hasMeeting ? "#ffedcc" : "white")};
`;

const baseURL = process.env.REACT_APP_BASEURL;


const getWeekRange = (date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + 1); // 월요일
  const end = new Date(start);
  end.setDate(start.getDate() + 4); // 금요일

  return {
    startdate: start.toISOString().split("T")[0],
    enddate: end.toISOString().split("T")[0],
    start,
    end,
  };
};



const MeetingRoomListWidget = ({ roomId , onMeetingClick }) => {
  console.log("✅ onMeetingClick 확인:", onMeetingClick); 
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!roomId) return; // 회의실이 선택되지 않으면 요청 안 함

    const { startdate, enddate } = getWeekRange(selectedDate);

    const fetchMeetings = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/meetingroom/book/${roomId}/`,
          {
            params: { startdate, enddate },
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );

        setMeetings(response.data);
      } catch (error) {
        console.error("회의 목록을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchMeetings();
  }, [roomId, selectedDate, meetings]);

  const { start, end } = getWeekRange(selectedDate);

  return (
    <ScheduleContainer>
      <h2>주간 회의 일정</h2>

      <div>
        <button
          onClick={() => setSelectedDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7); // 1주일 전으로 이동
            return newDate;
          })}
        >
          ◀ 이전 주
        </button>
        <strong>
          {start.toISOString().split("T")[0]} ~{" "}
          {new Date(end).toISOString().split("T")[0]}
        </strong>
        <button
          onClick={() => setSelectedDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7); // 1주일 후로 이동
            return newDate;
          })}
        >
          다음 주 ▶
        </button>
      </div>

      <Table>
        {/* 회의 목록을 `MeetingRoomBookedListWidget`으로 전달 */}
        <MeetingRoomBooked meetings={meetings.length > 0 ? meetings : []} onMeetingClick={onMeetingClick}  />      </Table>
    </ScheduleContainer>
  );
};

export default MeetingRoomListWidget;
