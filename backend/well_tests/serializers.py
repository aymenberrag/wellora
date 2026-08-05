from rest_framework import serializers

from .models import WellTest


class WellTestSerializer(serializers.ModelSerializer):

    class Meta:
        model = WellTest
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )