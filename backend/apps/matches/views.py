from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Like, Match
from .serializers import LikeRequestSerializer, UserPublicSerializer


User = get_user_model()


class DiscoverView(generics.ListAPIView):
    """
    List candidate users for the discover screen.

    - Excludes the current user
    - Excludes users that the current user has already liked
    """

    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        liked_ids = Like.objects.filter(from_user=user).values_list(
            "to_user_id", flat=True
        )
        return (
            User.objects.exclude(id=user.id)
            .exclude(id__in=liked_ids)
            .select_related("profile")
        )


class LikeView(APIView):
    """
    Handle a like from the current user to another user.

    If the other user has already liked back, a Match will be created.
    The response contains `match: true` when a new mutual match occurs.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LikeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        to_user_id = serializer.validated_data["to_user_id"]

        try:
            to_user = User.objects.get(pk=to_user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Target user not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if to_user == request.user:
            return Response(
                {"detail": "You cannot like yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Like.objects.get_or_create(
            from_user=request.user,
            to_user=to_user,
        )

        has_reverse_like = Like.objects.filter(
            from_user=to_user,
            to_user=request.user,
        ).exists()

        match_created = False
        if has_reverse_like:
            user1, user2 = sorted([request.user, to_user], key=lambda u: u.id)
            _, match_created = Match.objects.get_or_create(user1=user1, user2=user2)

        return Response({"match": has_reverse_like and match_created})


class MatchListView(generics.ListAPIView):
    """
    List all users that have a mutual match with the current user.
    """

    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        matches = Match.objects.filter(Q(user1=user) | Q(user2=user))
        other_user_ids = [
            match.user2_id if match.user1_id == user.id else match.user1_id
            for match in matches
        ]
        return User.objects.filter(id__in=other_user_ids).select_related("profile")

