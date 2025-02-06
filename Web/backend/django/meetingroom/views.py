from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.utils.dateparse import parse_datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Meeting, Agenda, MeetingParticipation
from .serializers import MeetingReadSerializer


User = get_user_model()

# Create your views here.
@api_view(['GET','POST'])
def meetingroom_list_create(request, room_id):
    """
    회의 목록 조회 및 생성 API
    - 'GET' : 특정 회의실(room_id) + 특정 기간의 회의 목록 반환
    - 'POST' : 회의 생성 및 참여자 추가
    """
    if request.method == "GET":
        # 필터링할 날짜 (startdate, enddate) 가져오기
        startdate = request.GET.get("startdate")
        enddate = request.GET.get("enddate")

        # 특정 회의실의 회의 목록 가져오기
        meetings = Meeting.objects.filter(room=room_id)

        if startdate and enddate:
            startdate = parse_datetime(startdate+ " 00:00:00")
            enddate = parse_datetime(enddate + " 23:59:59")
            print(startdate, enddate)  # 디버깅용 출력
            meetings = meetings.filter(starttime__range=(startdate, enddate))
            print(meetings.query)


        # 조회된 데이터가 없을 경우 예외 처리
        if not meetings.exists():
            return Response(
                {"status": "error", "message": "조건에 맞는 회의가 없습니다."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = MeetingReadSerializer(meetings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    # 회의 생성 및 참여자 추가
    elif request.method == "POST":
        serializer = MeetingReadSerializer(data=request.data)
        if serializer.is_valid():
            booker = request.user
            project = request.data.get("project")
            project = serializer.save(booker = booker,
                                      project = project
                                      ) # 현재 로그인한 유저가 생성자로 저장
            
            participants = request.data.get("participants", [])
            for participant in participants:
                user_id = participant.get("id")
                authority = participant.get("authority", 1) 
                meeting = participant.get("meeting",1)
                user= get_object_or_404(User, id=user_id)

                MeetingParticipation.objects.create(
                    meeting=meeting, participant = user, authority = authority
                )
            return  Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            {"status": "error", "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )