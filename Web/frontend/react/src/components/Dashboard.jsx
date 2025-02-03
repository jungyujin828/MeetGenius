import React from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar"; // 사이드바 컴포넌트 가져오기
import Navbar from "./Navbar"; // 네비게이션 바 컴포넌트 가져오기
import IssueWidget from "./IssueWidget"; // 이슈 위젯 가져오기
import NoticeWidget from "./NoticeWidget"; // 공지사항 위젯 가져오기
import ToDoWidget from "./ToDoWidget"; // 할 일 위젯 가져오기
import { DayPicker } from "react-day-picker"; // react-day-picker 임포트
import "react-day-picker/style.css"; // 기본 스타일링 불러오기

// ✅ 대시보드 전체 컨테이너
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh; /* 화면 전체 높이 사용 */
  width: 100vw; /* 화면 전체 너비 사용 */
`;

// ✅ 메인 콘텐츠 영역
const MainContent = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa; /* 배경색 */
  padding: 20px;
  overflow-y: auto; /* 세로 스크롤 가능하도록 설정 */
  width: 100%; /* 전체 화면 너비 사용 */
`;

// ✅ 배너 스타일
const Banner = styled.img`
  width: 60%; /* 전체 너비로 확장 */
  height: auto; /* 자동으로 비율에 맞게 크기 조정 */
  margin-bottom: 20px; /* 배너와 위젯 사이의 간격 설정 */
  margin-top: 20px; /* 배너와 위젯 사이의 간격 설정 */
`;

// ✅ 대시보드 위젯들을 배치할 그리드 컨테이너
const WidgetsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3열로 나누기 */
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; /* 모바일에서는 한 줄로 표시 */
  }
`;

// ✅ 달력 스타일
const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 250px; /* 달력의 가로 크기 */
  height: 250px; /* 달력의 세로 크기 (정사각형 형태) */
`;

// ✅ DayPicker 스타일
const StyledDayPicker = styled(DayPicker)`
  font-family: 'Arial', sans-serif;
  font-size: 14px;

  /* 달력의 배경 색상 */
  .rdp {
    background-color: #fff;
    border-radius: 12px;
    padding: 10px;
  }

  /* 달력 헤더 스타일 */
  .rdp-calendar-header {
    display: none; /* 요일 텍스트 및 헤더 숨기기 */
  }

  /* 날짜 스타일 */
  .rdp-day {
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
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
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Sidebar />
      <MainContent>
        <Navbar />
        
        {/* 배너 이미지 추가 */}
        <Banner src="/banner.png" alt="Banner" />

        {/* 그리드 레이아웃으로 위젯 배치 */}
        <WidgetsContainer>
          <IssueWidget />
          <ToDoWidget />
          {/* 달력 컴포넌트는 오른쪽에 배치 */}
          <CalendarContainer>
            <StyledDayPicker />
          </CalendarContainer>
        </WidgetsContainer>
        <NoticeWidget />
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
