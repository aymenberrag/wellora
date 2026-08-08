from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):

    company = serializers.StringRelatedField()

    class Meta:
        model = User
        exclude = (
            "password",
            "groups",
            "user_permissions",
        )


class LoginSerializer(serializers.Serializer):

    employee_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        user = authenticate(
            username=attrs["employee_id"],
            password=attrs["password"]
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid Employee ID or Password."
            )

        attrs["user"] = user
        return attrs


class ProfileUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "country",
            "state",
            "city",
            "address",
        )


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(write_only=True)

    new_password = serializers.CharField(write_only=True)

    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                "Passwords do not match."
            )

        return attrs

class UserListSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "company",
            "company_name",
            "job_title",
            "role",
            "is_active",
        )

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()