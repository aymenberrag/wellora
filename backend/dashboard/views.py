from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.models import Company
from fields.models import Field
from wells.models import Well
from measurements.models import WellMeasurement
from production.models import Production
from maintenance.models import Maintenance
from interventions.models import WellIntervention




class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        if user.is_superuser:

            companies = Company.objects.all()

            fields = Field.objects.all()

            wells = Well.objects.all()

            production = Production.objects.all()

            maintenance = Maintenance.objects.all()

            interventions = WellIntervention.objects.all()

            measurements = WellMeasurement.objects.all()

        else:

            companies = Company.objects.filter(id=user.company_id)

            fields = Field.objects.filter(company=user.company)

            wells = Well.objects.filter(field__company=user.company)

            production = Production.objects.filter(
                well__field__company=user.company
            )

            maintenance = Maintenance.objects.filter(
                well__field__company=user.company
            )

            interventions = WellIntervention.objects.filter(
                well__field__company=user.company
            )

            measurements = WellMeasurement.objects.filter(
                well__field__company=user.company
            )

        today = timezone.now().date()
        trend = []

        for i in range(6, -1, -1):
            day = today - timedelta(days=i)

            qs = production.filter(
                production_date=day
            )

            trend.append({
                "date": day.strftime("%d %b"),
                "oil": qs.aggregate(
                    Sum("oil_production")
                )["oil_production__sum"] or 0,

                "gas": qs.aggregate(
                    Sum("gas_production")
                )["gas_production__sum"] or 0,

                "water": qs.aggregate(
                    Sum("water_production")
                )["water_production__sum"] or 0,
            }),
            running_wells = measurements.filter(
                operating_status="Running"
            ).count()

            maintenance_wells = measurements.filter(
                operating_status="Maintenance"
            ).count()

            avg_whp = (
                measurements.aggregate(
                    Sum("wellhead_pressure")
                )["wellhead_pressure__sum"] or 0
            )

            avg_water_cut = (
                measurements.aggregate(
                    Sum("water_cut")
                )["water_cut__sum"] or 0
            )

            measurement_count = measurements.count()
        data = {
            "total_companies": companies.count(),
            "total_fields": fields.count(),
            "total_wells": wells.count(),

            "running_wells": running_wells,
            "maintenance_wells": maintenance_wells,
            "measurement_count": measurement_count,
            "avg_whp": avg_whp,
            "avg_water_cut": avg_water_cut,

            "today_oil": production.filter(
                production_date=today
            ).aggregate(
                Sum("oil_production")
            )["oil_production__sum"] or 0,

            "today_gas": production.filter(
                production_date=today
            ).aggregate(
                Sum("gas_production")
            )["gas_production__sum"] or 0,

            "today_water": production.filter(
                production_date=today
            ).aggregate(
                Sum("water_production")
            )["water_production__sum"] or 0,

            "ongoing_maintenance": maintenance.filter(
                status="In Progress"
            ).count(),

            "ongoing_interventions": interventions.filter(
                status="In Progress"
            ).count(),
            "production_trend": trend,
            "recent_measurements": [
                {
                    "id": m.id,

                    "well_code": m.well.code,
                    "well_name": m.well.name,

                    "field_name": m.well.field.name,

                    "operator_name": m.well.operator.name,

                    "measurement_date": m.measurement_date,

                    "operating_status": m.operating_status,

                    "wellhead_pressure": m.wellhead_pressure,

                    "water_cut": m.water_cut,
                }
                for m in measurements.select_related(
                    "well",
                    "well__field",
                    "well__operator",
                ).order_by(
                    "-measurement_date",
                    "-created_at",
                )[:10]
            ],

            "recent_production": [
                {
                    "id": p.id,
                    "well": p.well.name,
                    "production_date": p.production_date,
                    "oil_production": p.oil_production,
                }
                for p in production.order_by(
                    "-production_date"
                )[:5]
            ],

            "recent_maintenance": [
                {
                    "id": m.id,
                    "well": m.well.name,
                    "maintenance_type": m.maintenance_type,
                    "status": m.status,
                }
                for m in maintenance.order_by(
                    "-start_date"
                )[:5]
            ],

            "recent_interventions": [
                {
                    "id": i.id,
                    "well": i.well.name,
                    "intervention_type": i.intervention_type,
                    "status": i.status,
                }
                for i in interventions.order_by(
                    "-start_date"
                )[:5]
            ],
        }

        return Response(data)