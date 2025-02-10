from django.urls import path
from .views import receive_stt_test,SSEStreamView,start_meeting,stop_stt,test_page,prepare_meeting,scheduler,next_agenda

urlpatterns = [
    path('data_receive/', receive_stt_test, name="stt"),                     # FastAPI에서 Django로 data 보내는 API
    path('stream/',SSEStreamView.as_view(), name='stream'),         # clinet SSE 구독 주소
    path('start/',start_meeting),                                   # 회의 시작 버튼 연동(react)
    path('stop/',stop_stt),                                     # 회의 중지 버튼 연동(react)
    path('prepare/', prepare_meeting, name = 'prepare_meeting'),    # 회의 준비 버튼 연동(react)
    path('next/', next_agenda,name='next_agenda'),

    # 테스트
    path("test/",test_page, name='test'),
    path("scheduler/<int:meeting_id>/", scheduler, name='scheduler' )
]