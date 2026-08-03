from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "first_name",
        "last_name",
        "company",
        "job_title",
        "is_active",
    )

    list_filter = (
        "company",
        "gender",
        "is_active",
        "is_staff",
    )

    search_fields = (
        "username",
        "first_name",
        "last_name",
        "email",
    )

    ordering = (
        "username",
    )

    fieldsets = (
        ("Login Information", {
            "fields": (
                "username",
                "password",
            )
        }),

        ("Personal Information", {
            "fields": (
                "first_name",
                "last_name",
                "birth_date",
                "gender",
            )
        }),

        ("Contact Information", {
            "fields": (
                "email",
                "phone_number",
            )
        }),

        ("Address", {
            "fields": (
                "country",
                "state",
                "city",
                "address",
            )
        }),

        ("Employment", {
            "fields": (
                "company",
                "job_title",
                "hire_date",
            )
        }),

        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),

        ("Important Dates", {
            "fields": (
                "last_login",
                "date_joined",
            )
        }),
    )