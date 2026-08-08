from core.permissions import WelloraPermission


class ProductionPermission(WelloraPermission):
    resource = "production"