from rest_framework import serializers
from .models import Meeting, Agenda, MeetingParticipation
from django.contrib.auth import get_user_model
from projects.serializers import ProjectSerializer 
from projects.models import Project, ProjectParticipation

# 모델과 연결.
class MeetingReadSerializer(serializers.ModelSerializer):
    project = serializers.SerializerMethodField()
    class Meta:
        model = Meeting
        fields = [
            'id','project', 'title','room','starttime', 'endtime',
        ]
    def get_project(self, obj):
        return obj.project.name,

User = get_user_model()

class MeetingParticipationSerializer(serializers.ModelSerializer):
    participant = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = MeetingParticipation
        fields = ['id', 'meeting', 'participant', 'authority']

class AgendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agenda
        fields = ['id','meeting', 'order','title']

class MeetingBookSerializer(serializers.ModelSerializer):
    booker = serializers.ReadOnlyField(source='booker.name')
    meeting_participants = serializers.SerializerMethodField() 
    meeting_agendas = serializers.SerializerMethodField() 
    project = ProjectSerializer(read_only=True)
    starttime = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # 회의 시작 시간
    endtime = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # 회의 종료 시간
    

    class Meta:
        model = Meeting
        fields = ['id', 'room','title', 'starttime', 'endtime', 'booked_at', 'booker', 'project', 'meeting_participants', 'meeting_agendas']


    def get_meeting_participants(self, obj):
        return [
            {
                "id": p.participant.id,
                "name": p.participant.name,
                "authority": p.authority
            }
            for p in obj.participants.all() # 현재 회의의 모든 참여자.
        ]

    def get_meeting_agendas(self, obj):
        return [
            {
                "id": a.id,
                "title": a.title,
                "order": a.order
            }
            for a in obj.agenda_set.all()  # 현재 회의의 모든 안건
        ]
