from core.permissions import WelloraPermission


class MeasurementPermission(WelloraPermission):
    resource = "measurements"