import React from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar"; // 사이드바 컴포넌트 가져오기
import Navbar from "./Navbar"; // 네비게이션 바 컴포넌트 가져오기
import NoticeWidget from "./NoticeWidget"; // 공지사항 위젯 가져오기
import ToDoWidget from "./ToDoWidget"; // 할 일 위젯 가져오기
import { DayPicker } from "react-day-picker"; // react-day-picker 임포트
import "react-day-picker/style.css"; // 기본 스타일링 불러오기

// ✅ 대시보드 전체 컨테이너
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh; /* 화면 전체 높이 사용 */
  width: 100vw; /* 화면 전체 너비 사용 */
  overflow: hidden; /* 화면을 넘지 않도록 설정 */
`;

// ✅ 메인 콘텐츠 영역
const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
  width: 100%;
`;

// ✅ 배너와 달력을 나란히 배치할 컨테이너
const BannerAndCalendarContainer = styled.div`
  display: flex;
  margin-top: 60px;
  gap: 40px; /* 배너와 달력 간 간격 */
  flex-wrap: wrap; /* 화면 크기 축소 시 자동으로 한 줄로 줄어들게 */
`;

const Banner = styled.img`
  max-width: 100%; /* 배너 가로 크기 제한 */
  max-height: 300px; /* 배너 세로 크기 제한 */
  height: auto; /* 비율을 유지하면서 자동으로 세로 크기 조정 */
  margin-bottom: 20px;
  margin-top: 20px;
`;


// ✅ 달력 스타일
const CalendarContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 270px;
  height: 270px;
  margin-top: 20px;
`;

// ✅ DayPicker 스타일
const StyledDayPicker = styled(DayPicker)`
  font-family: 'Arial', sans-serif;
  font-size: 0.7rem; /* 기본 폰트 크기 설정 */
  text-align: center;

  .rdp {
    background-color: #fff;
    border-radius: 12px;
    padding: 3px;
    font-size: 1rem; /* 기본 폰트 크기 설정 */
  }

  .rdp-calendar-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.6rem; /* 캘린더 헤더 글씨 크기 */
    font-weight: bold;
    padding-bottom: 4px;
    padding-top: 4px;
  }

  .rdp-day {
    padding: 4px;
    border-radius: 8px;
    font-size: 0.8rem; /* 날짜 글씨 크기 줄이기 */
    font-weight: bold;
    margin: 2px; /* 날짜 간격 조정 */
  }

  .rdp-day:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }

  .rdp-day_selected {
    background-color: #274c77;
    color: white;
  }

  .rdp-day_disabled {
    color: #b0b0b0;
  }

  .rdp-caption {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    font-weight: bold;
  }
`;



// ✅ 위젯들 배치할 컨테이너
const WidgetsContainer = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 20px;
  flex-wrap: wrap; /* 반응형 처리 - 작은 화면에서 한 줄로 줄어듬 */
  align-items: flex-start; /* 위젯들이 세로로 정렬되도록 설정 */

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center; /* 작은 화면에서는 위젯들이 세로로 배치되고 중앙 정렬 */
  }
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Sidebar />
      <MainContent>
        <Navbar />
        <BannerAndCalendarContainer>
          <Banner src="/banner.png" alt="배너" />
          <CalendarContainer>
            <StyledDayPicker />
          </CalendarContainer>
        </BannerAndCalendarContainer>

        <WidgetsContainer>
          <ToDoWidget />
          <NoticeWidget />
        </WidgetsContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
