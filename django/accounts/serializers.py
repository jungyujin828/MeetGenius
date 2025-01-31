from django.contrib.auth.forms import AuthenticationForm
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    employee_number = serializers.IntegerField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context.get('request')
        form = AuthenticationForm(request, data={'username': attrs['employee_number'], 'password': attrs['password']})
        if not form.is_valid():
            raise serializers.ValidationError("잘못된 사번 또는 비밀번호입니다.")

        attrs['user'] = form.get_user()
        return attrs