from rest_framework import serializers

from .models import Well


class WellSerializer(serializers.ModelSerializer):

    field_name = serializers.CharField(
        source="field.name",
        read_only=True,
    )

    operator_name = serializers.CharField(
        source="operator.name",
        read_only=True,
    )

    class Meta:
        model = Well
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "field_name",
            "operator_name",
        )