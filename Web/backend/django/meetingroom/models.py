from django.db import models
from django.conf import settings
from projects.models import Project
# Create your models here.
class Meeting(models.Model):
    room = models.IntegerField()
    starttime = models.DateTimeField()
    endtime = models.DateTimeField()
    booked_at = models.DateTimeField(auto_now_add=True)
    booker = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='booked_meetings',
        null=True, blank=True
        )
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

class Agenda(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, null=True, blank=True)
    order = models.IntegerField(default=0)
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title
    
# 프로젝트참여자 모델   
class MeetingParticipation(models.Model):
    ROLE_CHOICES = [
        (0, "Master"),
        (1, "Participant"),
    ]
    
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name="participants")
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="meeting_participations")
    authority = models.IntegerField(choices=ROLE_CHOICES, default=1)

    class Meta:
        unique_together = ('meeting', 'participant')  # 한 사용자가 같은 회의의 중복 참여 방지

    def __str__(self):
        return f"{self.participant} - {self.meeting}"
    