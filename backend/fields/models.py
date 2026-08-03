from django.db import models

from core.models import BaseModel
from companies.models import Company


class Field(BaseModel):

    class Status(models.TextChoices):
        ACTIVE = "Active", "Active"
        DEVELOPMENT = "Development", "Development"
        INACTIVE = "Inactive", "Inactive"
        ABANDONED = "Abandoned", "Abandoned"

    name = models.CharField(max_length=200)

    code = models.CharField(
        max_length=20,
        unique=True
    )

    operator = models.ForeignKey(
        Company,
        on_delete=models.PROTECT,
        related_name="fields"
    )

    country = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

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

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "Field"
        verbose_name_plural = "Fields"

    def __str__(self):
        return f"{self.code} - {self.name}"