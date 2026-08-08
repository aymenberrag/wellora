from django.db import models


class ReportType(models.TextChoices):
    PRODUCTION = "PRODUCTION", "Production"
    WELL_TEST = "WELL_TEST", "Well Test"
    MAINTENANCE = "MAINTENANCE", "Maintenance"
    INTERVENTION = "INTERVENTION", "Intervention"
    MEASUREMENT = "MEASUREMENT", "Measurement"
    WELL = "WELL", "Well"
    FIELD = "FIELD", "Field"