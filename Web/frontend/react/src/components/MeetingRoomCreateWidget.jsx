import React, { useState } from "react";

// 기본 내보내기
const MeetingRoomCreateWidget = ({ onCreate }) => {
  const [newMeeting, setNewMeeting] = useState("");

  // ✅ 회의 생성 함수
  const handleSubmit = () => {
    if (newMeeting.trim()) {
      onCreate(newMeeting);
      setNewMeeting(""); // 입력 필드 초기화
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newMeeting}
        onChange={(e) => setNewMeeting(e.target.value)}
        placeholder="회의 이름을 입력하세요"
      />
      <button onClick={handleSubmit}>회의 생성</button>
    </div>
  );
};

export default MeetingRoomCreateWidget;  // 기본 내보내기
