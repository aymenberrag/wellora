from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Field


@admin.register(Field)
class FieldAdmin(ImportExportModelAdmin):
    list_display = (
        "code",
        "name",
        "operator",
        "status",
        "country",
    )

    search_fields = (
        "code",
        "name",
    )

    list_filter = (
        "operator",
        "status",
        "country",
    )

    ordering = (
        "name",
    )