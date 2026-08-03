from django.contrib.auth.models import AbstractUser
from django.db import models
from companies.models import Company

class User(AbstractUser):

    class Gender(models.TextChoices):
        MALE = "Male", "Male"
        FEMALE = "Female", "Female"

    # Login
    username = models.CharField(
        "Employee ID",
        max_length=20,
        unique=True
    )

    # Personal Information
    birth_date = models.DateField(
        blank=True,
        null=True
    )

    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
        blank=True,
        null=True
    )

    # Contact Information
    email = models.EmailField(
        blank=True,
        null=True
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    # Address
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

    company = models.ForeignKey(
    Company,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="employees",
    )

    # Employment
    hire_date = models.DateField(
        blank=True,
        null=True
    )
    job_title = models.CharField(
    max_length=100,
    blank=True,
    null=True,
    )
    def __str__(self):
        return f"{self.username} - {self.first_name} {self.last_name}"