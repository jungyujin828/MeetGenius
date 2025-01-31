from django.contrib import admin
from .models import Proejct

# Register your models here.

@admin.register(Proejct) #admin.site.register(Proejct) 와 동일.
class ProjectAdmin(admin.ModelAdmin):
    # 목록 페이지에 표시할 필드들
    list_display = ('id', 'name', 'department', 'creator', 'is_inprogress', 'startdate', 'duedate')
    # 아래 필드들을 필터로 추가해 관리자 페이지에서 보다 편하게 관리.
    list_filter = ('is_inprogress', 'department')
    # 관리자 검색 기능.
    search_fields = ('name', 'description')