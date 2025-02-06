from rest_framework import serializers
from .models import Meeting, Agenda, MeetingParticipation
from django.contrib.auth import get_user_model
from projects.serializers import ProjectSerializer  # ProjectSerializer import
from projects.serializers import Project, ProjectParticipation

# 모델과 연결.
class MeetingReadSerializer(serializers.ModelSerializer):
    project = serializers.SerializerMethodField()
    class Meta:
        model = Meeting
        fields = [
            'id','project', 'title','room','starttime', 'endtime',
        ]
    def get_project(self, obj):
        # project를 { name:, id: } 형식으로 반환
        return {
            'name': obj.project.name,
            'id': obj.project.id
        }

User = get_user_model()

class MeetingParticipationSerializer(serializers.ModelSerializer):
    participant = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = MeetingParticipation
        fields = ['id', 'meeting', 'participant', 'authority']

class MeetingBookSerializer(serializers.ModelSerializer):
    booker = serializers.ReadOnlyField(source='booker.name')
    participants = serializers.SerializerMethodField() 
    project = ProjectSerializer()
    starttime = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # 회의 시작 시간
    endtime = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # 회의 종료 시간


    class Meta:
        model = Meeting
        fields = ['id', 'room', 'starttime', 'endtime', 'booked_at', 'booker', 'project', 'participants', 'title']


    def get_participants(self, obj):
       participations = ProjectParticipation.objects.filter(project=obj.project)
       participants = [participation.participant.name for participation in participations]
       return participants

    def create(self, validated_data):
        # 프로젝트 이름을 받아서 프로젝트 객체를 가져오는 코드
        project_data = validated_data.pop('project')
        project = Project.objects.get(id=project_data['id'])  # 프로젝트 객체 조회
        validated_data['project'] = project  # 프로젝트 객체 설정

        meeting = Meeting.objects.create(**validated_data)
        return meeting
