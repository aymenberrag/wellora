from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "notification_type",
        "severity",
        "title",
        "is_read",
        "created_at",
    )
    list_filter = ("notification_type", "severity", "is_read")
    search_fields = ("user__username", "title", "message", "event_key")
    readonly_fields = ("created_at", "updated_at", "read_at")
    ordering = ("-created_at",)
