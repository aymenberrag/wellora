from django.db import models


class Company(models.Model):

    class CompanyType(models.TextChoices):
        OIL_COMPANY = "Oil Company", "Oil Company"
        SERVICE_COMPANY = "Service Company", "Service Company"
        DRILLING_CONTRACTOR = "Drilling Contractor", "Drilling Contractor"
        GOVERNMENT = "Government", "Government"
        CONSULTING = "Consulting", "Consulting"
        OTHER = "Other", "Other"

    name = models.CharField(max_length=200)

    short_name = models.CharField(
        max_length=20,
        unique=True
    )

    company_type = models.CharField(
        max_length=30,
        choices=CompanyType.choices
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    website = models.URLField(
        blank=True,
        null=True
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

    address = models.TextField(
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.short_name} - {self.name}"