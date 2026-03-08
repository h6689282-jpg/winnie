from django.conf import settings
from django.db import models


class Like(models.Model):
    """
    One directional "like" from one user to another.

    A mutual like between two users will produce a Match record.
    """

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="likes_given",
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="likes_received",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("from_user", "to_user")

    def __str__(self) -> str:
        return f"{self.from_user_id} -> {self.to_user_id}"


class Match(models.Model):
    """
    Symmetric match between two different users.

    We normalize the pair so that user1.id < user2.id to keep the
    (user1, user2) combination unique and order-independent.
    """

    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="matches_as_user1",
    )
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="matches_as_user2",
    )
    matched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user1", "user2")

    def save(self, *args, **kwargs):
        # Ensure user1.id < user2.id so that each pair is stored only once.
        if self.user1_id == self.user2_id:
            raise ValueError("Cannot create match with the same user.")
        if self.user1_id > self.user2_id:
            self.user1_id, self.user2_id = self.user2_id, self.user1_id
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Match({self.user1_id}, {self.user2_id})"

