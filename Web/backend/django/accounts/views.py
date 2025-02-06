from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth.forms import AuthenticationForm
from .serializers import UserSerializer
from rest_framework import status


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    if request.user.is_authenticated:
        return Response({"message": "이미 로그인되어 있습니다."}, status=status.HTTP_200_OK)

    form = AuthenticationForm(request, data={'username': request.data.get('employee_number'), 'password': request.data.get('password')})
    if form.is_valid():
        user = form.get_user()
        auth_login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    return Response({"error": "잘못된 사번 또는 비밀번호입니다."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])  # 로그아웃은 인증 없이 가능해야 함
def logout(request):
    if request.user.is_authenticated:
        auth_logout(request)  # 세션 삭제 (로그아웃 처리)
        return Response({"message": "성공적으로 로그아웃되었습니다."}, status=status.HTTP_200_OK)

    return Response({"message": "이미 로그아웃된 상태입니다."}, status=status.HTTP_400_BAD_REQUEST)
