from django.contrib import admin

from .models import DowntimeReason, WellMeasurement


@admin.register(DowntimeReason)
class DowntimeReasonAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
    )

    search_fields = (
        "name",
    )

    list_filter = (
        "is_active",
    )


@admin.register(WellMeasurement)
class WellMeasurementAdmin(admin.ModelAdmin):
    list_display = (
        "well",
        "measurement_date",
        "shift",
        "operating_status",
        "wellhead_pressure",
        "tubing_head_pressure",
        "flowline_pressure",
        "recorded_by",
    )

    search_fields = (
        "well__code",
        "well__name",
    )

    list_filter = (
        "measurement_date",
        "shift",
        "operating_status",
        "well",
    )

    date_hierarchy = "measurement_date"

    ordering = (
        "-measurement_date",
    )