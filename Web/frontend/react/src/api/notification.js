import axiosInstance from "./axiosInstance"; // Axios 인스턴스 가져오기

// ✅ 알림 가져오는 비동기 함수
export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get("/accounts/notifications/unread/");
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error.response?.data || "오류";
  }
};

// ✅ 알림 읽음 처리 함수
export const markAsRead = async (notification_id, setNotifications, setUnreadCount) => {
  try {
    await axiosInstance.post(`/accounts/notifications/mark_as_read/${notification_id}/`);

    // 읽음 처리 후 클라이언트 상태 업데이트
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // setUnreadCount((prev) => prev - 1);
  } catch (error) {
    console.error("알림 읽음 처리 실패:", error);
  }
};

