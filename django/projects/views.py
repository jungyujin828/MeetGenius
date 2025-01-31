from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes, authentication_classes

from rest_framework.response import Response
from rest_framework import status
from .models import Project, ProjectParticipation
from .serializers import ProjectSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly,AllowAny


# Create your views here.

User = get_user_model()


@api_view(['GET','POST'])
# @permission_classes([IsAuthenticatedOrReadOnly])  # 이게 있어야하네.. 왜지
@permission_classes([AllowAny])  # 이게 있어야하네.. 왜지
# 인증되지 않은 사용자는 읽기만 가능.(GET,HEAD,OPTIONS)
def project_list_create(request):
    """
    프록젝트 목록 조회 및 생성 API
    - 'GET' : 전체 목록 반환
    - 'POST' : 프로젝트 생성 및 참여자 추가
    
    - 로그인 구현 안 된 상태라 수정 해야함.
    """
    if request.method == "GET":
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    elif request.method == "POST":
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            creator = request.user if request.user.is_authenticated else None # 로그인 구현되면 수정하기.
            department_id = request.data.get("department")
            # project = serializer.save(creator = request.user) # 현재 로그인한 유저가 생성자로 저장
            project = serializer.save(creator = creator,
                                      department_id = department_id
                                      ) # 현재 로그인한 유저가 생성자로 저장
            
            participants = request.data.get("participants", [])
            for user_id in participants:
                user = get_object_or_404(User, id=user_id)
                ProjectParticipation.objects.create(
                    project=project, participant = user, authority = 1
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(
            {"status": "error", "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
    

@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny]) # 임시로 모두 허용
def project_update(request, project_id):
    """
    특정 프로젝트 수정하는 API
    - 'PUT' : 전체 필드 업데이트
    - 'PATCH' : 일부 필드 업데이트 -> 대부분의 경우에 얘가 더 유연한 듯.
    """
    project = get_object_or_404(Project, id=project_id)

    serializer = ProjectSerializer(project, data=request.data, partial =(request.method =='PATCH'))

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'status':'error','message':serializer.errors},status=status.HTTP_400_BAD_REQUEST)