from django.contrib import admin

from .models import Production


@admin.register(Production)
class ProductionAdmin(admin.ModelAdmin):
    list_display = (
        "well",
        "production_date",
        "oil_production",
        "gas_production",
        "water_production",
        "operating_hours",
    )

    search_fields = (
        "well__code",
        "well__name",
    )

    list_filter = (
        "production_date",
        "well",
    )

    date_hierarchy = "production_date"

    ordering = (
        "-production_date",
    )