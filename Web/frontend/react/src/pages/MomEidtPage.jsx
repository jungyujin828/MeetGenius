import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMeetingDetails , fetchMomsByMeetings} from "../api/meetingRoom";
import styled from "styled-components";

// 🌟 전체 페이지 스타일 (A4 문서 느낌)
const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 200px 0;
  display: flex;
  justify-content: center; /* 페이지 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  background-color: #f0f0f0; /* 회색 배경 (용지 구분) */
`;

const Container = styled.div`
  width: 794px; /* A4 용지 너비 */
  height: 1123px; /* A4 용지 높이 */
  padding: 60px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* 문서 그림자 효과 */
  font-family: "Arial", sans-serif;
  line-height: 1.8;
  text-align: left;
  overflow: auto; /* 내용이 많으면 스크롤 가능 */
  display: flex;
  flex-direction: column; /* 📌 세로 정렬 */
`;



const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid #000;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
`;

const Info = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
`;

const Content = styled.p`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
`;
const Footer = styled.div`
  text-align: right;
  font-size: 14px;
  color: #777;
  margin-top: auto; /* 
`;
const Logo = styled.img`
  width: 120px;
  height: auto;
`;

const MomEditPage = () => {
    const { meetingId } = useParams();
    const [meetingDetails, setMeetingDetails] = useState(null);
    const [meetingMoms, setMeetingMoms] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const meetingDetail = await fetchMeetingDetails(meetingId);
                setMeetingDetails(meetingDetail);

                const meetingMoms = await fetchMomsByMeetings(meetingId);
                setMeetingMoms(meetingMoms)

                console.log(meetingMoms)
            } catch (error) {
                console.error("회의 상세 정보를 불러오는 중 오류 발생:", error);
            }
        };

        if (meetingId) {
            fetchDetails();
        }
    }, [meetingId]);

    if (!meetingDetails) return <PageWrapper><Container>회의록을 불러오는 중...</Container></PageWrapper>;

    return (
        <PageWrapper>
            <Container>
                {/* 상단 헤더 */}
                <Header>
                    <div>
                        <Title>{meetingDetails.title}</Title>
                        <Info>
                            참여자:{" "}
                            {meetingDetails.meeting_participants
                                ?.map((participant) => participant.name)
                                .join(", ") || "정보 없음"}
                        </Info>
                    </div>
                    <Info>
                        Date: {new Date(meetingDetails.starttime).toLocaleDateString()}
                    </Info>
                </Header>

                {/* 안건 목록 */}
                <SectionTitle>안건 목록</SectionTitle>
                {meetingMoms?.length > 0 ? (
                    meetingMoms.map((agenda, agenda_title) => (
                        <Content key={agenda_title}>
                            <strong>안건 :</strong> {agenda.agenda_title}
                        </Content>
                    // <SectionTitle>회의 내용</SectionTitle>
                    // <Content>{agenda.agenda_result || "회의록 내용이 없습니다."}</Content>
                    ))
                ) : (
                    <Content>등록된 안건이 없습니다.</Content>
                )}

 {/* 푸터 */}
 <Footer>
 <Logo src="/203ai_logo.png" alt="203ai Logo" />
 </Footer>
            </Container>
        </PageWrapper>
    );
};

export default MomEditPage;
