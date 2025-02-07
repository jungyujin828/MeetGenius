from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

# Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    if request.user.is_authenticated:
        return JsonResponse({"message": "이미 로그인되어 있습니다."}, status=200)

    form = AuthenticationForm(request, data={'username': request.data.get('employee_number'), 'password': request.data.get('password')})
    if form.is_valid():
        user = form.get_user()
        auth_login(request, user)
        user_data = UserSerializer(user).data
        return JsonResponse(user_data, status=200)

    return JsonResponse({"error": "잘못된 사번 또는 비밀번호입니다."}, status=400)

# Logout 
@api_view(['POST'])
@permission_classes([AllowAny])  # 로그아웃은 인증 없이 가능해야 함
def logout(request):
    if request.user.is_authenticated:
        auth_logout(request)  # 세션 삭제 (로그아웃 처리)
        return JsonResponse({"message": "성공적으로 로그아웃되었습니다."}, status=200)
    return JsonResponse({"message": "이미 로그아웃된 상태입니다."}, status=400)


# 전체 User 필터링.
@api_view(['GET'])
@permission_classes([AllowAny])  # 로그아웃은 인증 없이 가능해야 함
def get_all_users(request):
    """
    전체 유저 목록 조회 API
    """

    users = User.objects.all()
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data, status = status.HTTP_200_OK)

# 부서별별 User 필터링.
@api_view(['GET'])
@permission_classes([AllowAny])  # 로그아웃은 인증 없이 가능해야 함
def get_users_by_department	(request, department_id):
    """
    부서별 유저 목록 조회 API
    """

    users = User.objects.filter(department_id = department_id)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status = status.HTTP_200_OK)