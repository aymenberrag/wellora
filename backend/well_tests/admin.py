from django.contrib import admin

from .models import WellTest


@admin.register(WellTest)
class WellTestAdmin(admin.ModelAdmin):
    list_display = (
        "well",
        "test_date",
        "oil_rate",
        "gas_rate",
        "water_rate",
        "wellhead_pressure",
    )

    search_fields = (
        "well__code",
        "well__name",
    )

    list_filter = (
        "test_date",
        "well",
    )

    date_hierarchy = "test_date"