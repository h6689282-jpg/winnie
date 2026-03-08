from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound

from .models import Profile
from .serializers import ProfileSerializer


User = get_user_model()


class MeProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update the profile of the currently authenticated user.

    If the profile does not exist yet, it will be created on first access.
    """

    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


class ProfileDetailView(generics.RetrieveAPIView):
    """
    Read-only public profile endpoint for a given user id.

    Used when browsing or viewing other users' profiles.
    """

    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs.get("user_id")
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist as exc:
            raise NotFound(detail="User not found") from exc
        profile, _ = Profile.objects.get_or_create(user=user)
        return profile

