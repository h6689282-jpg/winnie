import logging

from django.contrib.auth import get_user_model
from rest_framework import exceptions, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer


User = get_user_model()
logger = logging.getLogger(__name__)


class RegisterView(APIView):
    """
    Simple user registration endpoint.

    Returns the created user (without password) on success.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning("Register validation failed: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """JWT login with email + password. Returns access and refresh tokens."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip()
        password = request.data.get("password")

        if not email or password is None:
            raise exceptions.AuthenticationFailed(
                "No active account found with the given credentials"
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            User().set_password(password)
            raise exceptions.AuthenticationFailed(
                "No active account found with the given credentials"
            )

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed(
                "No active account found with the given credentials"
            )
        if not user.is_active:
            raise exceptions.AuthenticationFailed(
                "No active account found with the given credentials"
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


class MeView(APIView):
    """Return basic information of the currently authenticated user."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

