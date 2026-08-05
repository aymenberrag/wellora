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
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
    )

    list_filter = (
        "company",
        "role",
        "gender",
        "is_active",
        "is_staff",
        "is_superuser",
    )

    search_fields = (
        "username",
        "first_name",
        "last_name",
        "email",
        "phone_number",
    )

    ordering = (
        "username",
    )

    fieldsets = (
        (
            "Login Information",
            {
                "fields": (
                    "username",
                    "password",
                )
            },
        ),
        (
            "Personal Information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "birth_date",
                    "gender",
                )
            },
        ),
        (
            "Contact Information",
            {
                "fields": (
                    "email",
                    "phone_number",
                    "country",
                    "state",
                    "city",
                    "address",
                )
            },
        ),
        (
            "Employment",
            {
                "fields": (
                    "company",
                    "job_title",
                    "hire_date",
                    "role",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important Dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "email",
                    "company",
                    "job_title",
                    "role",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )