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

        data = {
            "total_companies": companies.count(),
            "total_fields": fields.count(),
            "total_wells": wells.count(),

            "active_wells": wells.filter(status="Active").count(),
            "shut_in_wells": wells.filter(status="Shut-In").count(),

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

            "recent_measurements": [],
            "recent_production": [],
            "recent_maintenance": [],
            "recent_interventions": [],
        }

        return Response(data)