from django.urls import path
from .views import login,logout,get_all_users,get_users_by_department,get_unread_notifications,mark_as_read

app_name = "accounts"

urlpatterns = [
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('users/', get_all_users, name ='get_all_users'), # 전체 유저 목록
    path('users/department/<int:department_id>/', get_users_by_department, name ='get_users_by_department'), # 부서별 유저 목록
    path('notifications/unread/', get_unread_notifications, name='get_unread_notifications'),
    path('notifications/mark_as_read/<int:notification_id>/', mark_as_read, name='mark_as_read'),
]