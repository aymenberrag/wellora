from django.contrib.auth import update_session_auth_hash

from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from core.audit import log_security_event
from core.permissions import scope_queryset_for_user, user_has_model_permission

from .models import User
from .permissions import UserPermission
from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    ProfileUpdateSerializer,
    UserCreateSerializer,
    UserListSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class LoginView(APIView):
    permission_classes = []
    throttle_scope = "login"

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        log_security_event(user, "login", "user", user.id, request=request)

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "login"

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            log_security_event(request.user, "logout", "user", request.user.id, request=request)
            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == "GET":
            return UserSerializer
        return ProfileUpdateSerializer


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "password"

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        update_session_auth_hash(request, user)
        log_security_event(user, "password_changed", "user", user.id, request=request)

        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)


class UserListView(ListCreateAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, UserPermission]

    def get_queryset(self):
        if not user_has_model_permission(self.request.user, "users", "view"):
            raise PermissionDenied("You do not have permission to view users.")

        queryset = User.objects.select_related("company")
        return scope_queryset_for_user(self.request.user, queryset, "users").order_by("first_name", "last_name")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return UserCreateSerializer
        return UserListSerializer

    def perform_create(self, serializer):
        requester = self.request.user
        if not user_has_model_permission(requester, "users", "add"):
            raise PermissionDenied("You do not have permission to add users.")

        if not requester.is_superuser and requester.role != User.Role.COMPANY_ADMIN:
            raise PermissionDenied("Only admins can manage users.")

        if not requester.is_superuser and serializer.validated_data.get("role") in {User.Role.SUPER_ADMIN, User.Role.COMPANY_ADMIN}:
            raise PermissionDenied("You cannot assign that role.")

        if not requester.is_superuser and serializer.validated_data.get("company") and serializer.validated_data["company"].id != requester.company_id:
            raise PermissionDenied("You can only create users for your own company.")

        user = serializer.save()
        log_security_event(requester, "user_created", "user", user.id, metadata={"company_id": getattr(user.company, "id", None)}, request=self.request)


class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.select_related("company")
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, UserPermission]

    def get_queryset(self):
        return scope_queryset_for_user(self.request.user, User.objects.select_related("company"), "users")

    def get_serializer_class(self):
        if self.request.method in {"PUT", "PATCH"}:
            return UserUpdateSerializer
        return UserListSerializer

    def perform_update(self, serializer):
        requester = self.request.user
        target_user = self.get_object()

        if target_user.id == requester.id:
            protected_fields = {"role", "company", "is_active"}
            if protected_fields.intersection(serializer.validated_data.keys()):
                raise PermissionDenied("You cannot modify your own security settings.")

        if not requester.is_superuser and requester.role != User.Role.COMPANY_ADMIN:
            raise PermissionDenied("Only admins can update users.")

        if not requester.is_superuser and serializer.validated_data.get("role") in {User.Role.SUPER_ADMIN, User.Role.COMPANY_ADMIN}:
            raise PermissionDenied("You cannot assign that role.")

        if not requester.is_superuser and serializer.validated_data.get("company") and serializer.validated_data["company"].id != requester.company_id:
            raise PermissionDenied("You can only update users within your own company.")

        serializer.save()
        log_security_event(requester, "role_changed", "user", target_user.id, metadata={"role": serializer.validated_data.get("role", target_user.role)}, request=self.request)

    def perform_destroy(self, instance):
        requester = self.request.user
        if instance.id == requester.id:
            raise PermissionDenied("You cannot delete your own account.")
        if not requester.is_superuser and requester.role != User.Role.COMPANY_ADMIN:
            raise PermissionDenied("Only admins can delete users.")
        instance.is_active = False
        instance.save(update_fields=["is_active"])
        log_security_event(requester, "user_disabled", "user", instance.id, request=self.request)