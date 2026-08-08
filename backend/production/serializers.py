from rest_framework import serializers

from .models import Production


class ProductionSerializer(serializers.ModelSerializer):

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

    class Meta:
        model = Production
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "well_name",
            "well_code",
            "field_name",
            "operator_name",
        )