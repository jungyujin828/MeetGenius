from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

from django.db import models
from django.utils import timezone

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


class UserManager(BaseUserManager):
    def create_user(self, employee_number, password=None, **extra_fields):
        if not employee_number:
            raise ValueError('사번은 필수 항목입니다.')
        user = self.model(employee_number=employee_number, **extra_fields)
        user.set_password(password)  # 비밀번호 암호화
        user.save(using=self._db)
        return user

    def create_superuser(self, employee_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(employee_number, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    employee_number = models.IntegerField(unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'employee_number'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.name
