from rest_framework import serializers

from .models import WellMeasurement


class WellMeasurementSerializer(serializers.ModelSerializer):

    class Meta:
        model = WellMeasurement
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )