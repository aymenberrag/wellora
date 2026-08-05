from django.db import models

from core.models import BaseModel
from wells.models import Well
from accounts.models import User
from companies.models import Company


class Maintenance(BaseModel):

    class MaintenanceType(models.TextChoices):
        PREVENTIVE = "Preventive", "Preventive"
        CORRECTIVE = "Corrective", "Corrective"
        INSPECTION = "Inspection", "Inspection"
        CALIBRATION = "Calibration", "Calibration"
        REPAIR = "Repair", "Repair"
        REPLACEMENT = "Replacement", "Replacement"

    class Status(models.TextChoices):
        PLANNED = "Planned", "Planned"
        IN_PROGRESS = "In Progress", "In Progress"
        COMPLETED = "Completed", "Completed"
        CANCELLED = "Cancelled", "Cancelled"

    well = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name="maintenance_records"
    )

    maintenance_type = models.CharField(
        max_length=20,
        choices=MaintenanceType.choices
    )

    title = models.CharField(max_length=200)

    description = models.TextField(
        blank=True,
        null=True
    )

    service_company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maintenance_jobs"
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_maintenance"
    )

    start_date = models.DateField()

    start_time = models.TimeField(
        blank=True,
        null=True
    )

    end_date = models.DateField(
        blank=True,
        null=True
    )

    end_time = models.TimeField(
        blank=True,
        null=True
    )

    estimated_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    actual_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNED
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    class Meta:
        ordering = ["-start_date", "-start_time"]

    def __str__(self):
        return f"{self.well.code} - {self.title}"