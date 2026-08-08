from datetime import datetime

from django.db.models import Sum, Avg, Count
from django.http import FileResponse

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


from reports.utils.intervention_pdf import (
    generate_intervention_pdf,
)
from production.models import Production
from reports.utils.well_test_pdf import (
    export_well_test_pdf,
)
from .utils.production_pdf import generate_production_pdf
from django.db.models import Avg, Max, Min, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, F, ExpressionWrapper, DurationField
from django.db.models.functions import Cast
from well_tests.models import WellTest
from interventions.models import WellIntervention

from django.http import HttpResponse
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment,PatternFill

class ProductionReportView(APIView):
    permission_classes = [IsAuthenticated]

    def build_report(self, request):
        queryset = Production.objects.select_related(
            "well",
            "well__field",
            "well__operator",
        )

        field_id = request.query_params.get("field")
        well_id = request.query_params.get("well")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        # -----------------------------
        # Filters
        # -----------------------------

        if field_id:
            queryset = queryset.filter(
                well__field_id=field_id
            )

        if well_id:
            queryset = queryset.filter(
                well_id=well_id
            )

        if date_from:
            try:
                date_from = datetime.strptime(
                    date_from,
                    "%Y-%m-%d"
                ).date()

                queryset = queryset.filter(
                    production_date__gte=date_from
                )

            except ValueError:
                raise ValueError(
                    "Invalid date_from format. Use YYYY-MM-DD."
                )

        if date_to:
            try:
                date_to = datetime.strptime(
                    date_to,
                    "%Y-%m-%d"
                ).date()

                queryset = queryset.filter(
                    production_date__lte=date_to
                )

            except ValueError:
                raise ValueError(
                    "Invalid date_to format. Use YYYY-MM-DD."
                )

        # -----------------------------
        # Summary
        # -----------------------------

        summary = queryset.aggregate(
            total_oil=Sum("oil_production"),
            total_gas=Sum("gas_production"),
            total_water=Sum("water_production"),
            average_oil=Avg("oil_production"),
            average_gas=Avg("gas_production"),
            average_water=Avg("water_production"),
            total_records=Count("id"),
        )

        # Convert None to 0
        for key in summary:
            if summary[key] is None:
                summary[key] = 0

        # -----------------------------
        # Daily production
        # -----------------------------

        daily_data = (
            queryset
            .values("production_date")
            .annotate(
                oil=Sum("oil_production"),
                gas=Sum("gas_production"),
                water=Sum("water_production"),
            )
            .order_by("production_date")
        )

        daily_production = []

        for item in daily_data:
            daily_production.append(
                {
                    "date": item["production_date"],
                    "oil": item["oil"] or 0,
                    "gas": item["gas"] or 0,
                    "water": item["water"] or 0,
                }
            )

        # -----------------------------
        # Top producing wells
        # -----------------------------

        top_wells_data = (
            queryset
            .values(
                "well_id",
                "well__code",
                "well__name",
            )
            .annotate(
                total_oil=Sum("oil_production"),
                total_gas=Sum("gas_production"),
                total_water=Sum("water_production"),
            )
            .order_by("-total_oil")[:10]
        )

        top_wells = []

        for item in top_wells_data:
            top_wells.append(
                {
                    "well_id": item["well_id"],
                    "well_code": item["well__code"],
                    "well_name": item["well__name"],
                    "oil": item["total_oil"] or 0,
                    "gas": item["total_gas"] or 0,
                    "water": item["total_water"] or 0,
                }
            )

        # -----------------------------
        # Final report data
        # -----------------------------

        return {
            "report": "Production Report",

            "filters": {
                "field": field_id,
                "well": well_id,
                "date_from": request.query_params.get(
                    "date_from"
                ),
                "date_to": request.query_params.get(
                    "date_to"
                ),
            },

            "summary": summary,

            "daily_production": daily_production,

            "top_wells": top_wells,
        }

    def get(self, request):
        try:
            report_data = self.build_report(request)

        except ValueError as error:
            return Response(
                {
                    "error": str(error)
                },
                status=400,
            )

        return Response(report_data)

    def pdf(self, request):
        try:
            report_data = self.build_report(request)

        except ValueError as error:
            return Response(
                {
                    "error": str(error)
                },
                status=400,
            )

        pdf_buffer = generate_production_pdf(
            report_data
        )

        return FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename="production-report.pdf",
            content_type="application/pdf",
        )

class ProductionReportPDFView(ProductionReportView):
    def get(self, request):
        return super().pdf(request)



class WellTestReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = WellTest.objects.select_related(
            "well",
            "well__field",
        )

        # -----------------------------
        # Filters
        # -----------------------------

        field_id = request.query_params.get("field")
        well_id = request.query_params.get("well")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        if field_id:
            queryset = queryset.filter(
                well__field_id=field_id
            )

        if well_id:
            queryset = queryset.filter(
                well_id=well_id
            )

        if date_from:
            queryset = queryset.filter(
                test_date__gte=date_from
            )

        if date_to:
            queryset = queryset.filter(
                test_date__lte=date_to
            )

        # -----------------------------
        # Summary
        # -----------------------------

        summary = queryset.aggregate(
            total_tests=Count("id"),

            average_oil_rate=Avg(
                "oil_rate"
            ),

            average_gas_rate=Avg(
                "gas_rate"
            ),

            average_water_rate=Avg(
                "water_rate"
            ),

            average_wellhead_pressure=Avg(
                "wellhead_pressure"
            ),

            average_bottomhole_pressure=Avg(
                "bottomhole_pressure"
            ),

            average_water_cut=Avg(
                "water_cut"
            ),

            average_gor=Avg(
                "gor"
            ),

            latest_test_date=Max(
                "test_date"
            ),
        )

        # -----------------------------
        # Test History
        # -----------------------------

        tests = queryset.order_by(
            "test_date"
        )

        test_history = [
            {
                "date": test.test_date,
                "well": test.well.code,

                "oil_rate": float(
                    test.oil_rate or 0
                ),

                "gas_rate": float(
                    test.gas_rate or 0
                ),

                "water_rate": float(
                    test.water_rate or 0
                ),

                "wellhead_pressure": (
                    float(test.wellhead_pressure)
                    if test.wellhead_pressure is not None
                    else None
                ),

                "bottomhole_pressure": (
                    float(test.bottomhole_pressure)
                    if test.bottomhole_pressure is not None
                    else None
                ),

                "choke_size": (
                    float(test.choke_size)
                    if test.choke_size is not None
                    else None
                ),

                "water_cut": (
                    float(test.water_cut)
                    if test.water_cut is not None
                    else None
                ),

                "gor": (
                    float(test.gor)
                    if test.gor is not None
                    else None
                ),
            }
            for test in tests
        ]

        # -----------------------------
        # Pressure Analysis
        # -----------------------------

        pressure_history = [
            {
                "date": test.test_date,
                "well": test.well.code,

                "wellhead_pressure": (
                    float(test.wellhead_pressure)
                    if test.wellhead_pressure is not None
                    else None
                ),

                "bottomhole_pressure": (
                    float(test.bottomhole_pressure)
                    if test.bottomhole_pressure is not None
                    else None
                ),
            }
            for test in tests
        ]

        # -----------------------------
        # Production Rates
        # -----------------------------

        production_history = [
            {
                "date": test.test_date,
                "well": test.well.code,

                "oil_rate": float(
                    test.oil_rate or 0
                ),

                "gas_rate": float(
                    test.gas_rate or 0
                ),

                "water_rate": float(
                    test.water_rate or 0
                ),
            }
            for test in tests
        ]
        well_performance = (
            queryset
            .values(
                "well__code",
                "well__name",
            )
            .annotate(
                average_oil_rate=Avg("oil_rate"),
                average_gas_rate=Avg("gas_rate"),
                average_water_rate=Avg("water_rate"),
                test_count=Count("id"),
            )
            .order_by("-average_oil_rate")
        )
        declining_wells = []

        well_ids = (
            queryset
            .values_list("well_id", flat=True)
            .distinct()
        )

        for well_id in well_ids:
            tests = list(
                queryset
                .filter(well_id=well_id)
                .order_by("test_date")
            )

            if len(tests) < 2:
                continue

            first = float(tests[0].oil_rate or 0)
            latest = float(tests[-1].oil_rate or 0)

            if first <= 0:
                continue

            decline_percentage = (
                (first - latest) / first
            ) * 100

            if decline_percentage > 0:
                declining_wells.append({
                    "well": tests[-1].well.code,
                    "first_oil_rate": first,
                    "latest_oil_rate": latest,
                    "decline_percentage": round(
                        decline_percentage,
                        2,
                    ),
                    "first_date": tests[0].test_date,
                    "latest_date": tests[-1].test_date,
                })

        declining_wells.sort(
            key=lambda x: x["decline_percentage"],
            reverse=True,
        )
        return Response({
            "report": "Well Test Report",

            "filters": {
                "field": field_id,
                "well": well_id,
                "date_from": date_from,
                "date_to": date_to,
            },

            "summary": summary,

            "test_history": test_history,

            "pressure_history": pressure_history,

            "production_history": production_history,
            "well_performance": [
                {
                    "well": item["well__code"],
                    "name": item["well__name"],
                    "average_oil_rate": float(
                        item["average_oil_rate"] or 0
                    ),
                    "average_gas_rate": float(
                        item["average_gas_rate"] or 0
                    ),
                    "average_water_rate": float(
                        item["average_water_rate"] or 0
                    ),
                    "test_count": item["test_count"],
                }
                for item in well_performance
            ],
            "declining_wells": declining_wells,
        })


class WellTestExcelExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = WellTest.objects.select_related(
            "well",
            "well__field",
        )

        # Filters
        field_id = request.query_params.get("field")
        well_id = request.query_params.get("well")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        if field_id:
            queryset = queryset.filter(
                well__field_id=field_id
            )

        if well_id:
            queryset = queryset.filter(
                well_id=well_id
            )

        if date_from:
            queryset = queryset.filter(
                test_date__gte=date_from
            )

        if date_to:
            queryset = queryset.filter(
                test_date__lte=date_to
            )

        queryset = queryset.order_by(
            "-test_date"
        )

        # Workbook
        workbook = Workbook()
        worksheet = workbook.active
        worksheet.title = "Well Tests"

        headers = [
            "Date",
            "Well",
            "Field",
            "Oil Rate (BOPD)",
            "Gas Rate (MSCFD)",
            "Water Rate (BWPD)",
            "Wellhead Pressure (psi)",
            "Bottomhole Pressure (psi)",
            "Choke Size (1/64 in)",
            "Water Cut (%)",
            "GOR (scf/STB)",
            "Remarks",
        ]

        worksheet.append(headers)

        # Header styling
        for cell in worksheet[1]:
            cell.font = Font(
                bold=True
            )

            cell.alignment = Alignment(
                horizontal="center"
            )

        # Data
        for test in queryset:
            worksheet.append([
                test.test_date,
                test.well.code,
                test.well.field.name
                if test.well.field
                else "",

                float(test.oil_rate or 0),

                float(test.gas_rate or 0),

                float(test.water_rate or 0),

                (
                    float(test.wellhead_pressure)
                    if test.wellhead_pressure is not None
                    else None
                ),

                (
                    float(test.bottomhole_pressure)
                    if test.bottomhole_pressure is not None
                    else None
                ),

                (
                    float(test.choke_size)
                    if test.choke_size is not None
                    else None
                ),

                (
                    float(test.water_cut)
                    if test.water_cut is not None
                    else None
                ),

                (
                    float(test.gor)
                    if test.gor is not None
                    else None
                ),

                test.remarks or "",
            ])

        # Column widths
        widths = [
            15,
            15,
            25,
            18,
            18,
            18,
            25,
            27,
            22,
            18,
            18,
            35,
        ]

        for index, width in enumerate(
            widths,
            start=1
        ):
            worksheet.column_dimensions[
                chr(64 + index)
            ].width = width

        # Freeze header
        worksheet.freeze_panes = "A2"

        # Response
        response = HttpResponse(
            content_type=(
                "application/vnd.openxmlformats-"
                "officedocument.spreadsheetml.sheet"
            )
        )

        response[
            "Content-Disposition"
        ] = (
            'attachment; '
            'filename="well_test_report.xlsx"'
        )

        workbook.save(response)

        return response


class WellTestPDFExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = WellTest.objects.select_related(
            "well",
            "well__field",
        )

        field_id = request.query_params.get("field")
        well_id = request.query_params.get("well")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        if field_id:
            queryset = queryset.filter(
                well__field_id=field_id
            )

        if well_id:
            queryset = queryset.filter(
                well_id=well_id
            )

        if date_from:
            queryset = queryset.filter(
                test_date__gte=date_from
            )

        if date_to:
            queryset = queryset.filter(
                test_date__lte=date_to
            )

        queryset = queryset.order_by(
            "-test_date"
        )

        filters = {
            "field": field_id,
            "well": well_id,
            "date_from": date_from,
            "date_to": date_to,
        }
        well_performance = (
            queryset
            .values(
                "well__code",
                "well__name",
            )
            .annotate(
                average_oil_rate=Avg("oil_rate"),
                average_gas_rate=Avg("gas_rate"),
                average_water_rate=Avg("water_rate"),
                test_count=Count("id"),
            )
            .order_by("-average_oil_rate")
        )

        well_performance = [
            {
                "well": item["well__code"],
                "name": item["well__name"],
                "average_oil_rate": float(
                    item["average_oil_rate"] or 0
                ),
                "average_gas_rate": float(
                    item["average_gas_rate"] or 0
                ),
                "average_water_rate": float(
                    item["average_water_rate"] or 0
                ),
                "test_count": item["test_count"],
            }
            for item in well_performance
        ]
        return export_well_test_pdf(
            queryset,
            filters,
            well_performance,
        )


class InterventionReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = WellIntervention.objects.select_related(
            "well",
            "well__field",
            "service_company",
            "supervisor",
        )

        # -----------------------------
        # Filters
        # -----------------------------

        field_id = request.query_params.get("field")
        well_id = request.query_params.get("well")
        intervention_type = request.query_params.get(
            "intervention_type"
        )
        status = request.query_params.get("status")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        if field_id:
            queryset = queryset.filter(
                well__field_id=field_id
            )

        if well_id:
            queryset = queryset.filter(
                well_id=well_id
            )

        if intervention_type:
            queryset = queryset.filter(
                intervention_type=intervention_type
            )

        if status:
            queryset = queryset.filter(
                status=status
            )

        if date_from:
            queryset = queryset.filter(
                start_date__gte=date_from
            )

        if date_to:
            queryset = queryset.filter(
                start_date__lte=date_to
            )

        queryset = queryset.order_by(
            "-start_date",
            "-start_time",
        )

        # -----------------------------
        # Executive Summary
        # -----------------------------

        total_interventions = queryset.count()

        completed = queryset.filter(
            status=WellIntervention.Status.COMPLETED
        ).count()

        in_progress = queryset.filter(
            status=WellIntervention.Status.IN_PROGRESS
        ).count()

        planned = queryset.filter(
            status=WellIntervention.Status.PLANNED
        ).count()

        cancelled = queryset.filter(
            status=WellIntervention.Status.CANCELLED
        ).count()

        # -----------------------------
        # History
        # -----------------------------

        history = []

        for intervention in queryset:
            history.append({
                "id": intervention.id,

                "well": intervention.well.code,

                "well_name": intervention.well.name,

                "field": (
                    intervention.well.field.name
                    if intervention.well.field
                    else None
                ),

                "intervention_type": (
                    intervention.intervention_type
                ),

                "title": intervention.title,

                "service_company": (
                    intervention.service_company.short_name
                    if intervention.service_company
                    else None
                ),

                "supervisor": (
                    intervention.supervisor.username
                    if intervention.supervisor
                    else None
                ),

                "start_date": (
                    intervention.start_date
                ),

                "start_time": (
                    intervention.start_time
                ),

                "end_date": (
                    intervention.end_date
                ),

                "end_time": (
                    intervention.end_time
                ),

                "status": intervention.status,

                "description": (
                    intervention.description
                ),

                "remarks": intervention.remarks,
            })
        # -----------------------------
        # Well Performance
        # -----------------------------

        well_performance = (
            queryset
            .values(
                "well__code",
                "well__name",
            )
            .annotate(
                intervention_count=Count("id")
            )
            .order_by("-intervention_count")
        )

        well_performance = [
            {
                "well": item["well__code"],
                "name": item["well__name"],
                "intervention_count": item[
                    "intervention_count"
                ],
            }
            for item in well_performance
        ]
        return Response({
            "report": "Intervention Report",

            "filters": {
                "field": field_id,
                "well": well_id,
                "intervention_type": (
                    intervention_type
                ),
                "status": status,
                "date_from": date_from,
                "date_to": date_to,
            },

            "summary": {
                "total_interventions":
                    total_interventions,

                "completed": completed,

                "in_progress": in_progress,

                "planned": planned,

                "cancelled": cancelled,
            },

            "history": history,
            "well_performance": well_performance,
        })

class InterventionReportExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        queryset = WellIntervention.objects.select_related(
            "well",
            "well__field",
            "service_company",
            "supervisor",
        )

        # -----------------------------
        # Filters
        # -----------------------------

        field_id = request.query_params.get("field")
        well_id = request.query_params.get("well")
        intervention_type = request.query_params.get(
            "intervention_type"
        )
        status = request.query_params.get("status")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        if field_id:
            queryset = queryset.filter(
                well__field_id=field_id
            )

        if well_id:
            queryset = queryset.filter(
                well_id=well_id
            )

        if intervention_type:
            queryset = queryset.filter(
                intervention_type=intervention_type
            )

        if status:
            queryset = queryset.filter(
                status=status
            )

        if date_from:
            queryset = queryset.filter(
                start_date__gte=date_from
            )

        if date_to:
            queryset = queryset.filter(
                start_date__lte=date_to
            )

        queryset = queryset.order_by(
            "-start_date",
            "-start_time",
        )

        # -----------------------------
        # Workbook
        # -----------------------------

        workbook = Workbook()

        sheet = workbook.active
        sheet.title = "Interventions"

        headers = [
            "Well",
            "Well Name",
            "Field",
            "Intervention Type",
            "Title",
            "Service Company",
            "Supervisor",
            "Start Date",
            "Start Time",
            "End Date",
            "End Time",
            "Status",
            "Description",
            "Remarks",
        ]

        sheet.append(headers)

        # Header style
        for cell in sheet[1]:
            cell.font = Font(
                bold=True,
                color="FFFFFF",
            )

            cell.fill = PatternFill(
                "solid",
                fgColor="2563EB",
            )

            cell.alignment = Alignment(
                horizontal="center"
            )

        # -----------------------------
        # Data
        # -----------------------------

        for intervention in queryset:

            sheet.append([
                intervention.well.code,

                intervention.well.name,

                (
                    intervention.well.field.name
                    if intervention.well.field
                    else ""
                ),

                intervention.intervention_type,

                intervention.title,

                (
                    intervention.service_company.short_name
                    if intervention.service_company
                    else ""
                ),

                (
                    intervention.supervisor.username
                    if intervention.supervisor
                    else ""
                ),

                intervention.start_date,

                intervention.start_time,

                intervention.end_date,

                intervention.end_time,

                intervention.status,

                intervention.description or "",

                intervention.remarks or "",
            ])

        # -----------------------------
        # Column widths
        # -----------------------------

        widths = {
            "A": 15,
            "B": 30,
            "C": 25,
            "D": 25,
            "E": 35,
            "F": 20,
            "G": 20,
            "H": 15,
            "I": 12,
            "J": 15,
            "K": 12,
            "L": 15,
            "M": 50,
            "N": 50,
        }

        for column, width in widths.items():
            sheet.column_dimensions[
                column
            ].width = width

        # -----------------------------
        # Response
        # -----------------------------

        response = HttpResponse(
            content_type=(
                "application/vnd.openxmlformats-"
                "officedocument.spreadsheetml.sheet"
            )
        )

        response[
            "Content-Disposition"
        ] = (
            'attachment; '
            'filename="intervention_report.xlsx"'
        )

        workbook.save(response)

        return response

class InterventionReportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        queryset = WellIntervention.objects.select_related(
            "well",
            "well__field",
            "service_company",
            "supervisor",
        )

        # -----------------------------
        # Filters
        # -----------------------------

        field_id = request.query_params.get(
            "field"
        )

        well_id = request.query_params.get(
            "well"
        )

        intervention_type = (
            request.query_params.get(
                "intervention_type"
            )
        )

        status = request.query_params.get(
            "status"
        )

        date_from = request.query_params.get(
            "date_from"
        )

        date_to = request.query_params.get(
            "date_to"
        )

        # -----------------------------
        # Apply filters
        # -----------------------------

        if field_id:
            queryset = queryset.filter(
                well__field_id=field_id
            )

        if well_id:
            queryset = queryset.filter(
                well_id=well_id
            )

        if intervention_type:
            queryset = queryset.filter(
                intervention_type=intervention_type
            )

        if status:
            queryset = queryset.filter(
                status=status
            )

        if date_from:
            queryset = queryset.filter(
                start_date__gte=date_from
            )

        if date_to:
            queryset = queryset.filter(
                start_date__lte=date_to
            )

        queryset = queryset.order_by(
            "-start_date",
            "-start_time",
        )

        # -----------------------------
        # Filters object
        # -----------------------------

        filters = {
            "field": field_id,
            "well": well_id,
            "intervention_type":
                intervention_type,
            "status": status,
            "date_from": date_from,
            "date_to": date_to,
        }

        # -----------------------------
        # Generate PDF
        # -----------------------------

        pdf_buffer = (
            generate_intervention_pdf(
                queryset,
                filters,
            )
        )

        response = HttpResponse(
            pdf_buffer.getvalue(),
            content_type="application/pdf",
        )

        response[
            "Content-Disposition"
        ] = (
            'attachment; '
            'filename="intervention_report.pdf"'
        )

        return response