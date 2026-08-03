from django.contrib import admin

from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "short_name",
        "name",
        "company_type",
        "country",
        "city",
        "is_active",
    )

    search_fields = (
        "short_name",
        "name",
    )

    list_filter = (
        "company_type",
        "country",
        "is_active",
    )

    ordering = (
        "name",
    )