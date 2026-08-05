from django.db import models

from core.models import BaseModel
from companies.models import Company
from fields.models import Field


class Well(BaseModel):

    class WellType(models.TextChoices):
        OIL = "Oil", "Oil"
        GAS = "Gas", "Gas"
        WATER_INJECTOR = "Water Injector", "Water Injector"
        GAS_INJECTOR = "Gas Injector", "Gas Injector"
        EXPLORATION = "Exploration", "Exploration"

    class Status(models.TextChoices):
        DRILLING = "Drilling", "Drilling"
        PRODUCING = "Producing", "Producing"
        SHUT_IN = "Shut In", "Shut In"
        WORKOVER = "Workover", "Workover"
        ABANDONED = "Abandoned", "Abandoned"

    class ArtificialLift(models.TextChoices):
        NATURAL_FLOW = "Natural Flow", "Natural Flow"
        ESP = "ESP", "ESP"
        GAS_LIFT = "Gas Lift", "Gas Lift"
        ROD_PUMP = "Rod Pump", "Rod Pump"
        PCP = "PCP", "PCP"
        OTHER = "Other", "Other"

    code = models.CharField(
        max_length=30,
        unique=True
    )

    name = models.CharField(
        max_length=200
    )

    field = models.ForeignKey(
        Field,
        on_delete=models.PROTECT,
        related_name="wells"
    )

    operator = models.ForeignKey(
        Company,
        on_delete=models.PROTECT,
        related_name="wells"
    )

    well_type = models.CharField(
        max_length=30,
        choices=WellType.choices
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PRODUCING
    )

    # Dates
    spud_date = models.DateField(
        blank=True,
        null=True
    )

    completion_date = models.DateField(
        blank=True,
        null=True
    )

    first_production_date = models.DateField(
        blank=True,
        null=True
    )

    # Technical Information
    total_depth = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Measured Depth (m)"
    )

    true_vertical_depth = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="True Vertical Depth (m)"
    )

    tubing_size = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    casing_size = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    artificial_lift = models.CharField(
        max_length=30,
        choices=ArtificialLift.choices,
        blank=True,
        null=True
    )

    # Reservoir Information
    reservoir = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    formation = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    # Location
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    # Other
    description = models.TextField(
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"