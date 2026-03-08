from django.apps import AppConfig
from django.db.models.signals import post_save


def create_profile_for_user(sender, instance, created, **kwargs):
    if created:
        from .models import Profile
        Profile.objects.get_or_create(user=instance)


class ProfilesConfig(AppConfig):
    """App configuration for user profile and interests module."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.profiles"

    def ready(self):
        from django.contrib.auth import get_user_model
        post_save.connect(create_profile_for_user, sender=get_user_model())

