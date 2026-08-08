from rest_framework import serializers

from .models import WellIntervention


class WellInterventionSerializer(serializers.ModelSerializer):

    well_name = serializers.CharField(
        source="well.name",
        read_only=True
    )

    company_name = serializers.CharField(
        source="service_company.name",
        read_only=True
    )

    supervisor_name = serializers.SerializerMethodField()

    class Meta:
        model = WellIntervention
        fields = (
            "id",

            "well",
            "well_name",

            "intervention_type",
            "title",
            "description",

            "service_company",
            "company_name",

            "supervisor",
            "supervisor_name",

            "start_date",
            "start_time",

            "end_date",
            "end_time",

            "status",
            "remarks",

            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "well_name",
            "company_name",
            "supervisor_name",
        )

    def get_supervisor_name(self, obj):

        if obj.supervisor:
            return (
                f"{obj.supervisor.first_name} "
                f"{obj.supervisor.last_name}"
            ).strip()

        return None