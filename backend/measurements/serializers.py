from rest_framework import serializers

from .models import WellMeasurement


class WellMeasurementSerializer(serializers.ModelSerializer):

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

    recorded_by_name = serializers.CharField(
        source="recorded_by.get_full_name",
        read_only=True,
    )

    downtime_reason_name = serializers.CharField(
        source="downtime_reason.name",
        read_only=True,
    )

    class Meta:
        model = WellMeasurement
        fields = "__all__"

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "well_name",
            "well_code",
            "field_name",
            "operator_name",
            "recorded_by_name",
            "downtime_reason_name",
        )
from .models import DowntimeReason


class DowntimeReasonSerializer(serializers.ModelSerializer):

    class Meta:
        model = DowntimeReason
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )