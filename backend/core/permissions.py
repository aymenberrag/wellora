from django.db.models import Q
from rest_framework.permissions import BasePermission, SAFE_METHODS

from accounts.models import User


ROLE_PERMISSIONS = {
    User.Role.SUPER_ADMIN: {
        "companies": {"view", "add", "change", "delete", "export"},
        "fields": {"view", "add", "change", "delete", "export"},
        "wells": {"view", "add", "change", "delete", "export"},
        "production": {"view", "add", "change", "delete", "export"},
        "measurements": {"view", "add", "change", "delete", "export"},
        "well_tests": {"view", "add", "change", "delete", "export"},
        "maintenance": {"view", "add", "change", "delete", "export"},
        "interventions": {"view", "add", "change", "delete", "export"},
        "reports": {"view", "export"},
        "notifications": {"view", "change", "delete"},
        "users": {"view", "add", "change", "delete"},
        "settings": {"view", "change"},
    },
    User.Role.COMPANY_ADMIN: {
        "companies": {"view", "change"},
        "fields": {"view", "add", "change", "delete"},
        "wells": {"view", "add", "change", "delete"},
        "production": {"view", "add", "change", "delete", "export"},
        "measurements": {"view", "add", "change", "delete", "export"},
        "well_tests": {"view", "add", "change", "delete"},
        "maintenance": {"view", "add", "change", "delete"},
        "interventions": {"view", "add", "change", "delete"},
        "reports": {"view", "export"},
        "notifications": {"view", "change", "delete"},
        "users": {"view", "add", "change", "delete"},
        "settings": {"view", "change"},
    },
    User.Role.PRODUCTION_ENGINEER: {
        "companies": {"view"},
        "fields": {"view", "add", "change"},
        "wells": {"view", "add", "change"},
        "production": {"view", "add", "change", "export"},
        "measurements": {"view", "add", "change", "export"},
        "well_tests": {"view", "add", "change"},
        "maintenance": {"view"},
        "interventions": {"view", "add", "change"},
        "reports": {"view", "export"},
        "notifications": {"view", "change"},
        "users": set(),
        "settings": {"view", "change"},
    },
    User.Role.FIELD_OPERATOR: {
        "companies": {"view"},
        "fields": {"view"},
        "wells": {"view"},
        "production": {"view", "add", "change"},
        "measurements": {"view", "add", "change"},
        "well_tests": {"view"},
        "maintenance": {"view"},
        "interventions": {"view"},
        "reports": {"view"},
        "notifications": {"view", "change"},
        "users": set(),
        "settings": {"view", "change"},
    },
    User.Role.MAINTENANCE_ENGINEER: {
        "companies": {"view"},
        "fields": {"view"},
        "wells": {"view"},
        "production": {"view"},
        "measurements": {"view"},
        "well_tests": {"view"},
        "maintenance": {"view", "add", "change"},
        "interventions": {"view", "add", "change"},
        "reports": {"view"},
        "notifications": {"view", "change"},
        "users": set(),
        "settings": {"view", "change"},
    },
    User.Role.VIEWER: {
        "companies": {"view"},
        "fields": {"view"},
        "wells": {"view"},
        "production": {"view"},
        "measurements": {"view"},
        "well_tests": {"view"},
        "maintenance": {"view"},
        "interventions": {"view"},
        "reports": {"view"},
        "notifications": {"view"},
        "users": set(),
        "settings": {"view", "change"},
    },
}


def get_role_permissions(role):
    return ROLE_PERMISSIONS.get(role, ROLE_PERMISSIONS[User.Role.VIEWER])


def user_has_model_permission(user, resource, action):
    if not user or not getattr(user, "is_authenticated", False):
        return False
    if not getattr(user, "is_active", False):
        return False
    if getattr(user, "is_superuser", False):
        return True
    return action in get_role_permissions(getattr(user, "role", User.Role.VIEWER)).get(resource, set())


def get_related_company_id(obj):
    if obj is None:
        return None

    if hasattr(obj, "company_id") and getattr(obj, "company_id", None):
        return getattr(obj, "company_id")

    if hasattr(obj, "operator_id") and getattr(obj, "operator_id", None):
        return getattr(obj, "operator_id")

    if hasattr(obj, "operator") and getattr(obj, "operator", None):
        operator = getattr(obj, "operator")
        if hasattr(operator, "id"):
            return operator.id

    if hasattr(obj, "field") and getattr(obj, "field", None):
        return get_related_company_id(getattr(obj, "field"))

    if hasattr(obj, "well") and getattr(obj, "well", None):
        return get_related_company_id(getattr(obj, "well"))

    if hasattr(obj, "company") and getattr(obj, "company", None):
        company = getattr(obj, "company")
        if hasattr(company, "id"):
            return company.id

    return None


def has_object_access(user, obj, resource):
    if not user or not getattr(user, "is_authenticated", False):
        return False
    if getattr(user, "is_superuser", False):
        return True
    if not getattr(user, "is_active", False):
        return False

    if resource == "companies":
        return getattr(user, "company_id", None) and getattr(obj, "id", None) == user.company_id

    if resource == "users":
        if user.id == getattr(obj, "id", None):
            return True
        return getattr(user, "company_id", None) and getattr(obj, "company_id", None) == user.company_id

    related_company_id = get_related_company_id(obj)
    if not related_company_id:
        return False

    return getattr(user, "company_id", None) == related_company_id


def scope_queryset_for_user(user, queryset, resource):
    if not user or not getattr(user, "is_authenticated", False):
        return queryset.none()
    if getattr(user, "is_superuser", False):
        return queryset
    if not getattr(user, "is_active", False):
        return queryset.none()

    company_id = getattr(user, "company_id", None)
    if not company_id:
        return queryset.none()

    if resource == "companies":
        return queryset.filter(id=company_id)

    if resource == "fields":
        return queryset.filter(operator_id=company_id)

    if resource == "wells":
        return queryset.filter(Q(operator_id=company_id) | Q(field__operator_id=company_id))

    if resource == "production":
        return queryset.filter(Q(well__operator_id=company_id) | Q(well__field__operator_id=company_id))

    if resource == "measurements":
        return queryset.filter(Q(well__operator_id=company_id) | Q(well__field__operator_id=company_id))

    if resource == "well_tests":
        return queryset.filter(Q(well__operator_id=company_id) | Q(well__field__operator_id=company_id))

    if resource == "maintenance":
        return queryset.filter(Q(well__operator_id=company_id) | Q(well__field__operator_id=company_id))

    if resource == "interventions":
        return queryset.filter(Q(well__operator_id=company_id) | Q(well__field__operator_id=company_id))

    if resource == "users":
        return queryset.filter(company_id=company_id)

    return queryset


class WelloraPermission(BasePermission):
    resource = None

    def get_required_action(self, request):
        if request.method in SAFE_METHODS:
            return "view"
        if request.method == "POST":
            return "add"
        if request.method in {"PUT", "PATCH"}:
            return "change"
        if request.method == "DELETE":
            return "delete"
        return "change"

    def has_permission(self, request, view):
        if not getattr(request.user, "is_authenticated", False):
            return False
        if not getattr(request.user, "is_active", False):
            return False
        if getattr(request.user, "is_superuser", False):
            return True
        return user_has_model_permission(request.user, self.resource, self.get_required_action(request))

    def has_object_permission(self, request, view, obj):
        if not getattr(request.user, "is_authenticated", False):
            return False
        if not getattr(request.user, "is_active", False):
            return False
        if getattr(request.user, "is_superuser", False):
            return True
        if not self.resource:
            return False
        if not user_has_model_permission(request.user, self.resource, self.get_required_action(request)):
            return False
        return has_object_access(request.user, obj, self.resource)


class ReportPermission(WelloraPermission):
    resource = "reports"

    def get_required_action(self, request):
        if "export" in request.path or "pdf" in request.path or "excel" in request.path:
            return "export"
        return "view"
