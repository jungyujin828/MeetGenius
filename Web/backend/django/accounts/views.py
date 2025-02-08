from rest_framework.response import Response  # DRF Response 추가
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.authtoken.models import Token


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    # 이미 로그인된 경우
    if request.user.is_authenticated:
        return Response({"message": "이미 로그인되어 있습니다."}, status=status.HTTP_200_OK)
    employee_number= request.data.get('employee_number')
    password= request.data.get('password')
    user = authenticate(request, username=employee_number, password=password)
    if user is not None:
        auth_login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        
        # 사용자 데이터를 serializer로 직렬화하고, 토큰 추가
        user_data = UserSerializer(user).data
        user_data['token'] = token.key  # 토큰 추가
        
        return Response(user_data, status=status.HTTP_200_OK)

    else:
        print("Form is invalid")
        return Response({"error": "입력하신 사번 또는 비밀번호가 맞지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout(request):
    if request.user.is_authenticated:
        auth_logout(request)
        return Response({"message": "성공적으로 로그아웃되었습니다."}, status=status.HTTP_200_OK)
    return Response({"error": "로그인 상태가 아닙니다."}, status=status.HTTP_400_BAD_REQUEST)