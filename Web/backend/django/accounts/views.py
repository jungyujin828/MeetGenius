from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework import status
from .models import Notification

User = get_user_model()

# Login
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


# Logout 
@api_view(['POST'])
@permission_classes([AllowAny])  # 로그아웃은 인증 없이 가능해야 함
def logout(request):
    if request.user.is_authenticated:
        auth_logout(request)  # 세션 삭제 (로그아웃 처리)
        return Response({"message": "성공적으로 로그아웃되었습니다."}, status=status.HTTP_200_OK)

    return Response({"message": "이미 로그아웃된 상태입니다."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_unread_notifications(request):
    user = request.user  # 현재 로그인한 사용자 가져오기

    # 해당 사용자의 읽지 않은 알림만 가져오기
    notifications = Notification.objects.filter(user=user, is_read=False)

    # 알림이 없다면 빈 리스트 반환
    if not notifications:
        return Response([], status=status.HTTP_200_OK)

    # 알림 데이터 반환
    notification_data = [
        {
            "id": notification.id,
            "message": notification.message,
        }
        for notification in notifications
    ]
    
    return Response(notification_data, status=status.HTTP_200_OK)

@api_view(['POST'])
def mark_as_read(request, notification_id):
    try:
        # 알림 조회
        notification = Notification.objects.get(id=notification_id)
        
        # 알림이 이미 읽은 상태일 경우 처리
        if notification.is_read:
            return Response(
                {"status": "error", "message": "이미 읽은 알림입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 알림 읽음 상태로 업데이트
        notification.is_read = True
        notification.save()

        return Response(
            {"status": "success", "message": "알림을 읽은 상태로 변경했습니다."},
            status=status.HTTP_200_OK
        )
    except Notification.DoesNotExist:
        return Response(
            {"status": "error", "message": "알림을 찾을 수 없습니다."},
            status=status.HTTP_404_NOT_FOUND
        )

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
