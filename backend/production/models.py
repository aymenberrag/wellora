from django.db import models

from core.models import BaseModel
from wells.models import Well


class Production(BaseModel):
    well = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name="production_records"
    )

    production_date = models.DateField()

    oil_production = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="Barrels of Oil Per Day (BOPD)"
    )

    gas_production = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="MSCFD"
    )

    water_production = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="Barrels of Water Per Day (BWPD)"
    )

    operating_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=24.00
    )

    downtime_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    class Meta:
        ordering = ["-production_date"]
        unique_together = ("well", "production_date")

    def __str__(self):
        return f"{self.well.code} - {self.production_date}"