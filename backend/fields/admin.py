from django.contrib import admin

from .models import Field


@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
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