from django.urls import path

from .views import MeProfileView, ProfileDetailView

urlpatterns = [
    path("me/", MeProfileView.as_view(), name="profile-me"),
    path("<int:user_id>/", ProfileDetailView.as_view(), name="profile-detail"),
]

