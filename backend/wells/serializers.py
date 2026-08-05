from rest_framework import serializers

from .models import Well


class WellSerializer(serializers.ModelSerializer):

    class Meta:
        model = Well
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )