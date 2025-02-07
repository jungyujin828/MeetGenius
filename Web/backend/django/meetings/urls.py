from django.urls import path
from .views import receive_stt_test,SSEStreamView,start_stt,stop_stt,test_page,prepare_meeting

urlpatterns = [
    path('stt/', receive_stt_test, name="stt"),                     # FastAPI에서 Django로 보내는 API
    path('stream/',SSEStreamView.as_view(), name='stream'),         # clinet SSE 구독
        # class 기반 View는 as_view() 활용.
    path('stt/start/',start_stt),                                   # 회의 시작 버튼
    path('stt/stop/',stop_stt),                                     # 회의 중지 버튼
    path('prepare/', prepare_meeting, name = 'prepare_meeting'),    # 회의 준비 버튼

    # 테스트
    path("test/",test_page, name='test')
]