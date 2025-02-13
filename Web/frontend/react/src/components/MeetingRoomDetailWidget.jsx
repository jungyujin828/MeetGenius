import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const DetailContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 350px; /* ✅ 전체 공간 차지 방지 */
  max-height: 500px; /* ✅ 높이 제한 */
  overflow-y: auto; /* ✅ 내용이 많을 경우 스크롤 */
`;

const DetailHeader = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const DetailItem = styled.p`
  margin: 5px 0;
  font-size: 14px;
`;

const List = styled.ul`
  padding-left: 20px;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.primary ? "#0056b3" : "#ffffff")};
  color: ${(props) => (props.primary ? "#ffffff" : "#000")};
  border: 1px solid #0056b3;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${(props) => (props.primary ? "#003f7f" : "#e6e6e6")};
  }
`;

const baseURL = import.meta.env.VITE_APP_BASEURL;

const MeetingRoomDetailWidget = ({ meetingId, onClose }) => {
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/meetingroom/booked/${meetingId}/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        setMeetingDetails(response.data);
      } catch (error) {
        console.error("회의 상세 정보를 불러오는 데 실패했습니다.", error);
        setError("회의 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (meetingId) {
      fetchMeetingDetails();
    }
  }, [meetingId, authToken]);

  if (loading) return <p>회의 정보를 불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (!meetingDetails) return <p>회의 정보가 없습니다.</p>;

  // 날짜 및 시간 포맷 변환 함수
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")} | ${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <DetailContainer>
      <DetailHeader>예약 내역</DetailHeader>
      <DetailItem><strong>회의명:</strong> {meetingDetails.title || "제목 없음"}</DetailItem>
      <DetailItem><strong>프로젝트:</strong> {meetingDetails.project?.name || "프로젝트 없음"}</DetailItem>
      <DetailItem><strong>회의실:</strong> ROOM {meetingDetails.room}</DetailItem>
      <DetailItem><strong>회의시간:</strong> {formatDateTime(meetingDetails.starttime)} - {formatDateTime(meetingDetails.endtime)}</DetailItem>
      <DetailItem><strong>주최자:</strong> {meetingDetails.booker || "주최자 없음"}</DetailItem>

      {/* 참석자 리스트 */}
      <DetailItem><strong>참여자:</strong></DetailItem>
      {meetingDetails.meeting_participants && meetingDetails.meeting_participants.length > 0 ? (
        <List>
          {meetingDetails.meeting_participants.map((participant, index) => (
            <li key={index}>{participant.name}</li>
          ))}
        </List>
      ) : (
        <DetailItem>참석자 없음</DetailItem>
      )}

      {/* 회의 안건 리스트 */}
      <DetailItem><strong>안건:</strong></DetailItem>
      {meetingDetails.meeting_agendas && meetingDetails.meeting_agendas.length > 0 ? (
        <List>
          {meetingDetails.meeting_agendas.map((agenda, index) => (
            <li key={index}>{agenda}</li>
          ))}
        </List>
      ) : (
        <DetailItem>안건 없음</DetailItem>
      )}

      {/* 버튼 */}
      <ButtonContainer>
        <Button onClick={onClose}>예약 취소</Button>
        <Button primary onClick={onClose}>예약 수정</Button>
      </ButtonContainer>
      <Button primary style={{ width: "100%", marginTop: "10px" }} onClick={onClose}>
        회의 참가하기
      </Button>
    </DetailContainer>
  );
};

export default MeetingRoomDetailWidget;
