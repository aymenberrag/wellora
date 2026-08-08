from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer
from .services import generate_operational_notifications


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            generate_operational_notifications()
        except Exception:
            # Notification generation must never make the bell unavailable.
            pass

        queryset = Notification.objects.filter(user=request.user)
        notification_type = request.query_params.get("type")
        severity = request.query_params.get("severity")
        is_read = request.query_params.get("is_read")

        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        if severity:
            queryset = queryset.filter(severity=severity)
        if is_read in {"true", "false"}:
            queryset = queryset.filter(is_read=is_read == "true")

        try:
            page = max(int(request.query_params.get("page", 1)), 1)
            page_size = min(max(int(request.query_params.get("page_size", 20)), 1), 100)
        except (TypeError, ValueError):
            return Response({"detail": "page and page_size must be integers."}, status=400)
        total = queryset.count()
        unread_count = Notification.objects.filter(
            user=request.user,
            is_read=False,
        ).count()
        start = (page - 1) * page_size
        results = queryset[start:start + page_size]

        return Response({
            "count": total,
            "unread_count": unread_count,
            "page": page,
            "page_size": page_size,
            "results": NotificationSerializer(results, many=True).data,
        })


class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = Notification.objects.filter(
            id=pk,
            user=request.user,
        ).first()
        if not notification:
            return Response({"detail": "Notification not found."}, status=404)

        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save(update_fields=["is_read", "read_at", "updated_at"])
        return Response(NotificationSerializer(notification).data)


class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated = Notification.objects.filter(
            user=request.user,
            is_read=False,
        ).update(is_read=True, read_at=timezone.now())
        return Response({"updated": updated})


class NotificationDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        deleted, _ = Notification.objects.filter(
            id=pk,
            user=request.user,
        ).delete()
        if not deleted:
            return Response({"detail": "Notification not found."}, status=404)
        return Response(status=204)
