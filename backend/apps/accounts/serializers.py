from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Lightweight representation of a user for API responses."""

    class Meta:
        model = User
        fields = ["id", "email", "username"]


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer used for user registration.

    Accepts a raw password, hashes it, and creates a new user.
    """

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password"]
        extra_kwargs = {
            "email": {
                "error_messages": {"unique": "A user with this email already exists."},
            },
            "username": {
                "error_messages": {"unique": "A user with that username already exists."},
            },
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        # Create user with password in one go so it is never set to unusable.
        user = User(
            email=validated_data["email"],
            username=validated_data["username"],
        )
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    JWT login with email + password.
    Request body must be { "email": "...", "password": "..." }.
    """
    username_field = "email"

