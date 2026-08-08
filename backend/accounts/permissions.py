from core.permissions import WelloraPermission


class UserPermission(WelloraPermission):
    resource = "users"
