from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.utils.dateparse import parse_datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Meeting, Agenda, MeetingParticipation
from .serializers import MeetingReadSerializer, MeetingBookSerializer

from projects.models import Project
from projects.serializers import ProjectSerializer, ProjectParticipationSerializer
from accounts.models import Notification
import json

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
            meetings = meetings.filter(starttime__range=(startdate, enddate))

        # 조회된 데이터가 없을 경우 예외 처리
        if not meetings.exists():
            return Response(
                {"status": "error", "message": "조건에 맞는 회의가 없습니다."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = MeetingReadSerializer(meetings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    # 회의 생성
    elif request.method == "POST":
        # 요청 데이터 가져오기
        request_data = request.data.copy()

        # meetingday와 시간 결합하여 starttime, endtime 수정
        meetingday =request_data.get("meetingday")
        starttime = request_data.get("starttime")
        endtime = request_data.get("endtime")

        # 잘못된 데이터 처리
        if not meetingday or not starttime or not endtime:
            return Response(
                {"status": "error", "message": "meetingday, starttime, endtime 값이 필요합니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        request_data['starttime'] = meetingday + "T" + starttime
        request_data['endtime'] = meetingday + "T" + endtime

        # serializer에 수정된 데이터 전달
        serializer = MeetingBookSerializer(data=request_data)

        if serializer.is_valid():
            booker=request.user
            project_name = request_data.get("project_name")
            # 프로젝트 조회 (공백 제거 및 예외 처리)
            try:
                project =  get_object_or_404(Project, name=project_name)  
            except Project.DoesNotExist:
                return Response(
                    {"status": "error"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            # 회의 객체 생성
            meeting = serializer.save(room=room_id, booker=booker, project=project)


            meeting_participants = request_data.get("participants", [])

            # participants가 문자열이면 JSON 변환
            if isinstance(meeting_participants, str):
                try:
                    meeting_participants = json.loads(meeting_participants)
                except json.JSONDecodeError:
                    return Response(
                        {"status": "error", "message": "Invalid meeting_participants format"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            for participant in meeting_participants:
                user_id = participant.get("id")
                authority = participant.get("authority", 1) 

                user= get_object_or_404(User, id=user_id)
                
                MeetingParticipation.objects.create(
                    meeting=meeting,
                    participant=user,
                    authority=authority
                )
                # 알림 생성
                # 회의 예약 메시지 생성
                message = f"새로운 회의가 예약되었습니다. 회의 제목: {meeting.title}, 시작 시간: {meeting.starttime.strftime('%Y-%m-%d %H:%M')}"
                Notification.objects.create(user=user, message=message)

        # agenda 처리
        agenda_items = request_data.get("agenda_items", [])

        if isinstance(agenda_items, str):
            try:
                agenda_items = json.loads(agenda_items)
            except json.JSONDecodeError:
                return Response(
                    {"status": "error", "message": "Invalid agenda format"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        for agenda_item in agenda_items:
            order = agenda_item.get("order")
            title = agenda_item.get("title")
            if not title:
                return Response(
                    {"status": "error", "message": "Agenda title is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            Agenda.objects.create(
                meeting=meeting,
                title=title,
                order=order
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            {"status": "error", "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
    

@api_view(['GET'])
def project_detail(request, project_name):
    """
    특정 회의실(room_id)와 프로젝트(project_id)의 상세 정보를 조회하는 API
    """
    # 요청한 프로젝트를 조회
    project = get_object_or_404(Project, name=project_name)

    if request.method == 'GET':  # 상세 보기 요청
        participants = project.participants.all()
        serializer = ProjectParticipationSerializer(participants, many=True)
        return Response({"project_participation":serializer.data}, status=status.HTTP_200_OK)
    



@api_view(['GET','PATCH','DELETE'])
def meeting_detail(request, meeting_id):
    meeting = get_object_or_404(Meeting, id=meeting_id)
    if request.method == "GET":
        serializer = MeetingBookSerializer(meeting)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    elif request.method == "DELETE":
        user = request.user
        participation = MeetingParticipation.objects.filter(meeting=meeting, participant=user).first()

        if participation and participation.authority == 0:  # '0'은 마스터 권한을 의미
            # 마스터 권한이 있다면 회의 삭제
            meeting.delete()
            return Response(
                {"status": "success", "message": "성공적으로 회의가 취소되었습니다."},
                status=status.HTTP_204_NO_CONTENT
            )
        else:
            # 참여 정보가 없거나, 권한이 없는 경우
            if participation is None:
                return Response(
                    {"status": "error", "message": "참여 정보가 없습니다."},
                    status=status.HTTP_404_NOT_FOUND
                )
            else:
                authority = participation.authority
                participant = participation.participant
                return Response(
                    {"status": "error", "message": "삭제 권한이 없습니다.",},
                    status=status.HTTP_403_FORBIDDEN
                )
    
