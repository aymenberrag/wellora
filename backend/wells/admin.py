from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Well


@admin.register(Well)
class WellAdmin(ImportExportModelAdmin):
    list_display = (
        "code",
        "name",
        "field",
        "operator",
        "well_type",
        "status",
        "artificial_lift",
        "is_active",
    )

    search_fields = (
        "code",
        "name",
        "reservoir",
        "formation",
    )

    list_filter = (
        "field",
        "operator",
        "well_type",
        "status",
        "artificial_lift",
        "is_active",
    )

    ordering = (
        "code",
    )