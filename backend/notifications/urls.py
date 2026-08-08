from django.urls import path

from .views import (
    MarkAllNotificationsReadView,
    NotificationDeleteView,
    NotificationListView,
    NotificationReadView,
)

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("mark-all-read/", MarkAllNotificationsReadView.as_view(), name="notification-mark-all-read"),
    path("<int:pk>/read/", NotificationReadView.as_view(), name="notification-read"),
    path("<int:pk>/", NotificationDeleteView.as_view(), name="notification-delete"),
]
