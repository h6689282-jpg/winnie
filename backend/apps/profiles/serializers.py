from typing import List

from rest_framework import serializers

from .models import Interest, Profile


class InterestSerializer(serializers.ModelSerializer):
    """Serializer for simple interest tags."""

    class Meta:
        model = Interest
        fields = ["id", "name"]


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Profile.

    - `interests` is read-only, expanded as nested objects.
    - `interest_names` accepts a list of strings to upsert related interests.
    """

    interests = InterestSerializer(many=True, read_only=True)
    interest_names = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "nickname",
            "age",
            "gender",
            "location",
            "bio",
            "avatar_url",
            "interests",
            "interest_names",
        ]
        read_only_fields = ["user"]

    def _update_interests(self, profile: Profile, names: List[str]) -> None:
        """Create or reuse Interest objects from a list of names and attach them."""

        interests = []
        for name in names:
            name = name.strip()
            if not name:
                continue
            interest, _ = Interest.objects.get_or_create(name=name)
            interests.append(interest)
        profile.interests.set(interests)

    def update(self, instance, validated_data):
        names = validated_data.pop("interest_names", None)
        instance = super().update(instance, validated_data)
        if names is not None:
            self._update_interests(instance, names)
        return instance

    def create(self, validated_data):
        names = validated_data.pop("interest_names", [])
        profile = super().create(validated_data)
        if names:
            self._update_interests(profile, names)
        return profile

