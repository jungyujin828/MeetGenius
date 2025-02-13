import axios from 'axios';

// API 기본 URL 설정
const baseURL = import.meta.env.VITE_APP_BASEURL;

// 회의 목록을 가져오는 함수
export const fetchMeetings = async (roomId, startdate, enddate) => {
    const authToken = localStorage.getItem("authToken");
    const url = roomId
    ? `${baseURL}/meetingroom/book/${roomId}/`  // 특정 회의실에 대한 회의 예약 목록
    : `${baseURL}/meetingroom/mymeeting/`;  // 내 회의 예약 목록
    // startdate와 enddate가 없으면 생략
    const params = {};
    if (startdate !== null) params.startdate = startdate;
    if (enddate !== null) params.enddate = enddate;
    
  try {
    const response = await axios.get(url, {
      params: { startdate, enddate },
      headers: {
        Authorization: `Token ${authToken}`, // 토큰을 헤더에 추가
      },
    });
    console.log("회의 목록 조회",response.data)
    return response.data;  // 회의 데이터 반환
  } catch (error) {
    console.error("회의 목록을 불러오는 데 실패했습니다.", error);
    throw error;  // 에러를 던져서 호출한 곳에서 처리하도록 함
  }
};
