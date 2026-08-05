from django.db import models

from core.models import BaseModel
from wells.models import Well


class WellTest(BaseModel):
    well = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name="well_tests"
    )

    test_date = models.DateField()

    oil_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="BOPD"
    )

    gas_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="MSCFD"
    )

    water_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="BWPD"
    )

    wellhead_pressure = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="psi"
    )

    bottomhole_pressure = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="psi"
    )

    choke_size = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="1/64 inch"
    )

    water_cut = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="%"
    )

    gor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="scf/STB"
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    class Meta:
        ordering = ["-test_date"]
        unique_together = ("well", "test_date")

    def __str__(self):
        return f"{self.well.code} - {self.test_date}"