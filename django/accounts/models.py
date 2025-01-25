from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

from django.db import models

from django.utils.timezone import now

# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='부서명')

    def __str__(self):
        return self.name

class Position(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='직급명')

    def __str__(self):
        return self.name
    
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

