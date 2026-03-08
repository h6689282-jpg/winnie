from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Like


User = get_user_model()


class UserPublicSerializer(serializers.ModelSerializer):
    """
    Public-facing user information used on discover/matches screens.

    Most fields are read from the related Profile model.
    """

    nickname = serializers.CharField(source="profile.nickname", read_only=True)
    age = serializers.IntegerField(source="profile.age", read_only=True)
    gender = serializers.CharField(source="profile.gender", read_only=True)
    location = serializers.CharField(source="profile.location", read_only=True)
    avatar_url = serializers.CharField(source="profile.avatar_url", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "nickname",
            "age",
            "gender",
            "location",
            "avatar_url",
        ]


class LikeRequestSerializer(serializers.Serializer):
    """Payload for sending a like to another user."""

    to_user_id = serializers.IntegerField()
    action = serializers.CharField()

    def validate_action(self, value: str) -> str:
        if value != "like":
            raise serializers.ValidationError("action must be 'like'.")
        return value

