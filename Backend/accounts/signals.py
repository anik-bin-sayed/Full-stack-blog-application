from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from userProfile.models import *


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        ProfileImage.objects.create(user=instance)
        CoverImage.objects.create(user=instance)
        Follow.objects.create(follower=instance, following=instance)
