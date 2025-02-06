from rest_framework import serializers
from .models import Meeting, Agenda, MeetingParticipation
from django.contrib.auth import get_user_model
from projects.serializers import ProjectSerializer  # ProjectSerializer import

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

    def get_participants(self, obj):
        return [
            {
                "id": p.participant.id,
                "name": p.participant.name,
                "authority": p.authority
            }
            for p in obj.participants.all()
        ]