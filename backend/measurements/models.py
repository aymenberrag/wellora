from django.db import models

from core.models import BaseModel
from wells.models import Well
from accounts.models import User


class DowntimeReason(BaseModel):
    name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class WellMeasurement(BaseModel):

    class Shift(models.TextChoices):
        DAY = "Day", "Day"
        NIGHT = "Night", "Night"

    class OperatingStatus(models.TextChoices):
        RUNNING = "Running", "Running"
        SHUT_IN = "Shut In", "Shut In"
        MAINTENANCE = "Maintenance", "Maintenance"
        STARTUP = "Startup", "Startup"
        SHUTDOWN = "Shutdown", "Shutdown"

    well = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name="measurements"
    )

    measurement_date = models.DateField()

    shift = models.CharField(
        max_length=10,
        choices=Shift.choices,
        default=Shift.DAY
    )

    recorded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="measurements"
    )

    operating_status = models.CharField(
        max_length=20,
        choices=OperatingStatus.choices,
        default=OperatingStatus.RUNNING
    )

    # Pressures (psi)
    wellhead_pressure = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    tubing_head_pressure = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    casing_pressure = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    flowline_pressure = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    # Temperatures (°C)
    wellhead_temperature = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    flowline_temperature = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)

    # Choke
    choke_size = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    # Artificial Lift
    esp_frequency = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    motor_current = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)

    # Fluid Properties
    water_cut = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    gor = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    bsw = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    # Downtime
    downtime_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    downtime_reason = models.ForeignKey(
        DowntimeReason,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="measurements"
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    class Meta:
        ordering = ["-measurement_date"]
        constraints = [
            models.UniqueConstraint(
                fields=["well", "measurement_date", "shift"],
                name="unique_well_measurement"
            )
        ]

    def __str__(self):
        return f"{self.well.code} - {self.measurement_date} ({self.shift})"