from django.conf import settings
from django.db import models


class Interest(models.Model):
    """Tag-like interest entity that can be attached to many profiles."""

    name = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.name


class Profile(models.Model):
    """Extended user profile containing public matching information."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    nickname = models.CharField(max_length=50, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    interests = models.ManyToManyField(
        Interest,
        related_name="profiles",
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.nickname or self.user.email

