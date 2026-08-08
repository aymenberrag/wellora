from django.conf import settings
from django.db import models

from core.models import BaseModel


class Notification(BaseModel):
    class NotificationType(models.TextChoices):
        PRODUCTION = "production", "Production"
        MEASUREMENT = "measurement", "Measurement"
        WELL = "well", "Well"
        MAINTENANCE = "maintenance", "Maintenance"
        INTERVENTION = "intervention", "Intervention"
        WELL_TEST = "well_test", "Well Test"
        SYSTEM = "system", "System"

    class Severity(models.TextChoices):
        INFO = "info", "Info"
        WARNING = "warning", "Warning"
        CRITICAL = "critical", "Critical"
        SUCCESS = "success", "Success"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices)
    severity = models.CharField(max_length=20, choices=Severity.choices)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    url = models.CharField(max_length=500, blank=True, null=True)
    event_key = models.CharField(max_length=255)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "event_key"],
                name="unique_user_notification_event",
            ),
        ]
        indexes = [
            models.Index(fields=["user", "is_read", "-created_at"]),
            models.Index(fields=["notification_type", "-created_at"]),
            models.Index(fields=["event_key"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.title}"
