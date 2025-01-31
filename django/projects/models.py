from django.db import models
from django.conf import settings
from accounts.models import Department

# Create your models here.
class Proejct(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, related_name='projects'
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_projects',
        # 잠시동안만 null blank true.. 로그인 못하잖아
        null=True, blank=True 
    )
    is_inprogress = models.BooleanField(default=True)
    startdate = models.DateTimeField()
    duedate = models.DateTimeField()

    def __str__(self):
        return self.name
    
class ProjectParticipation(models.Model):
    ROLE_CHOICES = [
        (0, "Master"),
        (1, "Participant"),
    ]
    
    project = models.ForeignKey(Proejct, on_delete=models.CASCADE, related_name="participants")
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="project_participations")
    authority = models.IntegerField(choices=ROLE_CHOICES, default=1)

    class Meta:
        unique_together = ('project', 'participant')  # 한 사용자가 같은 프로젝트 중복 참여 방지

    def __str__(self):
        return f"{self.participant} - {self.project}"