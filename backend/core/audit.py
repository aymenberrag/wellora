from django.conf import settings

from .models import AuditLog


def log_security_event(user, action, model_name, object_id=None, metadata=None, request=None):
    ip_address = None
    if request is not None:
        ip_address = request.META.get("REMOTE_ADDR")

    AuditLog.objects.create(
        user=user,
        action=action,
        model_name=model_name,
        object_id=str(object_id) if object_id is not None else None,
        ip_address=ip_address,
        metadata=metadata or {},
    )
