from django.db import models

from core.models import BaseModel
from wells.models import Well
from accounts.models import User
from companies.models import Company


class WellIntervention(BaseModel):

    class InterventionType(models.TextChoices):
        WIRELINE = "Wireline", "Wireline"
        SLICKLINE = "Slickline", "Slickline"
        COILED_TUBING = "Coiled Tubing", "Coiled Tubing"
        ACID_STIMULATION = "Acid Stimulation", "Acid Stimulation"
        HYDRAULIC_FRACTURING = "Hydraulic Fracturing", "Hydraulic Fracturing"
        ESP_INSTALLATION = "ESP Installation", "ESP Installation"
        ESP_REPLACEMENT = "ESP Replacement", "ESP Replacement"
        TUBING_REPLACEMENT = "Tubing Replacement", "Tubing Replacement"
        CEMENTING = "Cementing", "Cementing"
        PERFORATION = "Perforation", "Perforation"
        FISHING = "Fishing", "Fishing"
        WELL_KILL = "Well Kill", "Well Kill"
        OTHER = "Other", "Other"

    class Status(models.TextChoices):
        PLANNED = "Planned", "Planned"
        IN_PROGRESS = "In Progress", "In Progress"
        COMPLETED = "Completed", "Completed"
        CANCELLED = "Cancelled", "Cancelled"

    well = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name="interventions"
    )

    intervention_type = models.CharField(
        max_length=50,
        choices=InterventionType.choices
    )

    title = models.CharField(
        max_length=200
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    service_company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="interventions"
    )

    supervisor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="supervised_interventions"
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
        return f"{self.well.code} - {self.intervention_type}"