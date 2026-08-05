from rest_framework.permissions import BasePermission, SAFE_METHODS

from accounts.models import User


class CompanyPermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        if request.method in SAFE_METHODS:
            return True

        return request.user.role == User.Role.COMPANY_ADMIN

    def has_object_permission(self, request, view, obj):

        if request.user.is_superuser:
            return True

        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.role == User.Role.COMPANY_ADMIN
            and request.user.company == obj
        )