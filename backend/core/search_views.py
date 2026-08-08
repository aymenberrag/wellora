from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.models import Company
from fields.models import Field
from interventions.models import WellIntervention
from maintenance.models import Maintenance
from production.models import Production
from wells.models import Well


class GlobalSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = (request.query_params.get("q") or "").strip()
        if not query:
            return Response({"results": []})

        results = []
        limit = 5

        for well in Well.objects.select_related("field").filter(
            Q(code__icontains=query) | Q(name__icontains=query)
        ).order_by("code")[:limit]:
            results.append({
                "type": "well",
                "id": well.id,
                "title": well.code,
                "subtitle": well.name,
                "url": "/wells",
            })

        for field in Field.objects.select_related("operator").filter(
            Q(name__icontains=query)
            | Q(code__icontains=query)
            | Q(city__icontains=query)
            | Q(state__icontains=query)
        ).order_by("name")[:limit]:
            results.append({
                "type": "field",
                "id": field.id,
                "title": field.name,
                "subtitle": f"{field.code} · {field.city or 'Field'}",
                "url": "/fields",
            })

        for company in Company.objects.filter(
            Q(name__icontains=query) | Q(short_name__icontains=query)
        ).order_by("short_name")[:limit]:
            results.append({
                "type": "company",
                "id": company.id,
                "title": company.short_name,
                "subtitle": company.name,
                "url": "/companies",
            })

        for intervention in WellIntervention.objects.select_related("well").filter(
            Q(title__icontains=query)
            | Q(intervention_type__icontains=query)
            | Q(well__code__icontains=query)
        ).order_by("-start_date")[:limit]:
            results.append({
                "type": "intervention",
                "id": intervention.id,
                "title": intervention.title,
                "subtitle": f"{intervention.well.code} · Intervention",
                "url": "/interventions",
            })

        for maintenance in Maintenance.objects.select_related("well").filter(
            Q(title__icontains=query)
            | Q(maintenance_type__icontains=query)
            | Q(well__code__icontains=query)
        ).order_by("-start_date")[:limit]:
            results.append({
                "type": "maintenance",
                "id": maintenance.id,
                "title": maintenance.title,
                "subtitle": f"{maintenance.well.code} · Maintenance",
                "url": "/maintenance",
            })

        for production in Production.objects.select_related("well").filter(
            Q(well__code__icontains=query) | Q(remarks__icontains=query)
        ).order_by("-production_date")[:limit]:
            results.append({
                "type": "production",
                "id": production.id,
                "title": production.well.code,
                "subtitle": f"Production · {production.production_date}",
                "url": "/production",
            })

        return Response({"results": results[:25]})
