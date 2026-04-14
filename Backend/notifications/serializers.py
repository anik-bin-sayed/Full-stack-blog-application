from rest_framework import serializers

from .models import *
from Blogs.serializers import BlogMiniSerializer
from userProfile.serializers import ProfileMiniSerializer, ProfileMiniImageSerializer
from userProfile.models import ProfileImage


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username", read_only=True)
    blog_data = BlogMiniSerializer(source="blog", read_only=True)
    user_data = ProfileMiniSerializer(source="sender.profile", read_only=True)
    profile_image = ProfileMiniImageSerializer(
        source="sender.profileimage_set", many=True, read_only=True
    )

    def get_profile_image(self, obj):
        img = ProfileImage.objects.filter(user=obj.sender, is_current=True).first()

        if img:
            return ProfileMiniImageSerializer(img).data
        return None

    class Meta:
        model = Notification
        fields = "__all__"
