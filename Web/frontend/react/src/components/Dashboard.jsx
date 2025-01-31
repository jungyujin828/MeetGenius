import React from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar"; // 사이드바 컴포넌트 가져오기
import Navbar from "./Navbar"; // 네비게이션 바 컴포넌트 가져오기
import IssueWidget from "./IssueWidget"; // 이슈 위젯 가져오기
import NoticeWidget from "./NoticeWidget"; // 공지사항 위젯 가져오기
import ToDoWidget from "./ToDoWidget"; // 할 일 위젯 가져오기

// ✅ 대시보드 전체 컨테이너
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh; /* 화면 전체 높이 사용 */
`;

// ✅ 메인 콘텐츠 영역
const MainContent = styled.div`
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa; /* 배경색 */
  padding: 20px;
  overflow-y: auto; /* 세로 스크롤 가능하도록 설정 */
`;

// ✅ 위젯을 배치할 컨테이너 (그리드 형태)
const WidgetsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* 2:1 비율로 나누기 */
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; /* 모바일에서는 한 줄로 표시 */
  }
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Sidebar />
      <MainContent>
        <Navbar />
        <WidgetsContainer>
          <IssueWidget />
          <ToDoWidget />
        </WidgetsContainer>
        <NoticeWidget />
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
