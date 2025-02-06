from rest_framework import serializers
from .models import Meeting, Agenda, MeetingParticipation
from django.contrib.auth import get_user_model

# 모델과 연결.
class MeetingSerializer(serializers.ModelSerializer):
    booker = serializers.ReadOnlyField(source='booker.name') 
    project = serializers.ReadOnlyField(source = 'project.name')
    participants = serializers.SerializerMethodField()
    class Meta:
        model = Meeting
        fields = [
            'id', 'room', 'starttime', 'endtime', 'booked_at',
            'booker', 'project', 'title', 'participants' 
        ]
    
    def get_participants(self, obj):
        return [
            {
                "id": p.participant.id,
                "name": p.participant.name,
                "authority": p.authority
            }
            for p in obj.participants.all() # 현재 프로젝트의 모든 참여자.
        ]


User = get_user_model()

class MeetingParticipationSerializer(serializers.ModelSerializer):
    participant = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = MeetingParticipation
        fields = ['id', 'meeting', 'participant', 'authority']
