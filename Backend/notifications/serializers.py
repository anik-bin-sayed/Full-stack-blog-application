from rest_framework import serializers

from .models import *


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username")

    class Meta:
        model = Notification
        fields = "__all__"
