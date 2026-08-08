from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import WellIntervention


@admin.register(WellIntervention)
class WellInterventionAdmin(ImportExportModelAdmin):

    list_display = (
        "well",
        "intervention_type",
        "service_company",
        "status",
        "start_date",
        "start_time",
    )

    search_fields = (
        "well__code",
        "well__name",
        "title",
    )

    list_filter = (
        "intervention_type",
        "status",
        "service_company",
    )

    date_hierarchy = "start_date"

    ordering = (
        "-start_date",
        "-start_time",
    )