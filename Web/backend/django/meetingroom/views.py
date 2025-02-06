from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view

from django.http import JsonResponse
from rest_framework import status
from .models import Meeting, Agenda, MeetingParticipation
from .serializers import MeetingSerializer

User = get_user_model()

# Create your views here.
@api_view(['GET','POST'])
def meetingroom_list_create(request):
    """
    회의 목록 조회 및 생성 API
    - 'GET' : 전체 목록 반환
    - 'POST' : 회의 생성 및 참여자 추가
    """
    if request.method == "GET":
        meetings = Meeting.objects.all()
        serializer = MeetingSerializer(meetings, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    
    # 프로젝트 생성 및 참여자 추가
    elif request.method == "POST":
        serializer = MeetingSerializer(data=request.data)
        if serializer.is_valid():
            creator = request.user
            department_id = request.data.get("department")
            
            # project = serializer.save(creator = creator,
            #                           department_id = department_id
            #                           ) # 현재 로그인한 유저가 생성자로 저장
            
            # participants = request.data.get("participants", [])
            # for participant in participants:
            #     user_id = participant.get("id")
            #     authority = participant.get("authority", 1) 
            #     meeting = participant.get("meeting",1)
            #     user= get_object_or_404(User, id=user_id)

            #     MeetingParticipation.objects.create(
            #         meeting=meeting, participant = user, authority = authority
            #     )
            # return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

            return department_id
        

        return JsonResponse(
            {"status": "error", "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )