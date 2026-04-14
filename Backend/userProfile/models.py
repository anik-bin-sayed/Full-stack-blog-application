from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField

User = settings.AUTH_USER_MODEL


class ProfileImage(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    image = CloudinaryField("image")
    is_current = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.is_current:
            ProfileImage.objects.filter(user=self.user, is_current=True).update(
                is_current=False
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.id}"


class CoverImage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = CloudinaryField("image")
    is_current = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.is_current:
            CoverImage.objects.filter(user=self.user, is_current=True).update(
                is_current=False
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.id}"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    fullname = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    birthdate = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        blank=True,
    )
    language = models.CharField(max_length=50, blank=True)
    timezone = models.CharField(max_length=50, blank=True)

    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)

    website = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    social_links = models.JSONField(default=dict, blank=True)

    language_preference = models.CharField(max_length=20, blank=True)
    dark_mode_enabled = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username


class Follow(models.Model):
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="following"
    )

    following = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following")

    def __str__(self):
        return f"{self.follower} -> {self.following}"
