from django.contrib.auth import update_session_auth_hash

from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    UserSerializer,
    ProfileUpdateSerializer,
    ChangePasswordSerializer,
)


class LoginView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

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

    def post(self, request):

        try:
            refresh_token = request.data["refresh"]

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logged out successfully."},
                status=status.HTTP_200_OK,
            )

        except Exception:

            return Response(
                {"error": "Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )


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

    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(
            serializer.validated_data["old_password"]
        ):

            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save()

        update_session_auth_hash(request, user)

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )