from core.permissions import WelloraPermission


class MaintenancePermission(WelloraPermission):
    resource = "maintenance"