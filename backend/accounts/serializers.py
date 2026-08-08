from django.contrib.auth import authenticate
from rest_framework import serializers

from core.permissions import get_role_permissions

from .models import User


class UserSerializer(serializers.ModelSerializer):

    company = serializers.StringRelatedField(read_only=True)
    company_name = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = (
            "password",
            "groups",
            "user_permissions",
        )

    def get_company_name(self, obj):
        return obj.company.name if obj.company else None

    def get_permissions(self, obj):
        permission_map = get_role_permissions(obj.role)
        permissions = []
        for resource, actions in permission_map.items():
            for action in sorted(actions):
                permissions.append(f"{resource}.{action}")
        return permissions


class LoginSerializer(serializers.Serializer):

    employee_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs["employee_id"],
            password=attrs["password"],
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_active:
            raise serializers.ValidationError("Account is inactive.")

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
            raise serializers.ValidationError("Passwords do not match.")

        if len(attrs["new_password"]) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")

        return attrs


class UserListSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.name",
        read_only=True,
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


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "country",
            "state",
            "city",
            "address",
            "company",
            "job_title",
            "role",
            "is_active",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
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
            "company",
            "job_title",
            "role",
            "is_active",
        )