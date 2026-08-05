from django.contrib import admin

from .models import Maintenance


@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = (
        "well",
        "title",
        "maintenance_type",
        "service_company",
        "status",
        "start_date",
        "start_time",
        "end_date",
        "end_time",
    )

    search_fields = (
        "title",
        "well__code",
        "well__name",
    )

    list_filter = (
        "maintenance_type",
        "status",
        "service_company",
    )

    date_hierarchy = "start_date"

    ordering = (
        "-start_date",
        "-start_time",
    )