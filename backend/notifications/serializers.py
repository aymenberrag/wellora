from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="notification_type", read_only=True)

    class Meta:
        model = Notification
        fields = (
            "id",
            "type",
            "severity",
            "title",
            "message",
            "is_read",
            "created_at",
            "read_at",
            "url",
        )
        read_only_fields = fields
