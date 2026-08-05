from django.contrib import admin

from .models import Well


@admin.register(Well)
class WellAdmin(admin.ModelAdmin):
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