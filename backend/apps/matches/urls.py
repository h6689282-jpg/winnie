from django.urls import path

from .views import DiscoverView, LikeView, MatchListView

urlpatterns = [
    path("discover/", DiscoverView.as_view(), name="discover"),
    path("likes/", LikeView.as_view(), name="like"),
    path("matches/", MatchListView.as_view(), name="matches"),
]

