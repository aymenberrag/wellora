from rest_framework import serializers

from .models import WellTest


class WellTestSerializer(serializers.ModelSerializer):

    well_name = serializers.CharField(
        source="well.name",
        read_only=True,
    )

    class Meta:
        model = WellTest
        fields = (
            "id",
            "well",
            "well_name",
            "test_date",
            "oil_rate",
            "gas_rate",
            "water_rate",
            "wellhead_pressure",
            "bottomhole_pressure",
            "choke_size",
            "water_cut",
            "gor",
            "remarks",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "well_name",
            "created_at",
            "updated_at",
        )