from rest_framework import serializers

from .models import Maintenance


class MaintenanceSerializer(serializers.ModelSerializer):

    well_name = serializers.CharField(
        source="well.name",
        read_only=True,
    )

    well_code = serializers.CharField(
        source="well.code",
        read_only=True,
    )

    field_name = serializers.CharField(
        source="well.field.name",
        read_only=True,
    )

    operator_name = serializers.CharField(
        source="well.operator.name",
        read_only=True,
    )

    service_company_name = serializers.CharField(
        source="service_company.name",
        read_only=True,
    )

    assigned_to_name = serializers.CharField(
        source="assigned_to.get_full_name",
        read_only=True,
    )

    class Meta:
        model = Maintenance
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "well_name",
            "well_code",
            "field_name",
            "operator_name",
            "service_company_name",
            "assigned_to_name",
        )