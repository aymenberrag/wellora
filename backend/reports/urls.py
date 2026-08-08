from django.urls import path

from .views import (
    InterventionReportExcelView,
    InterventionReportPDFView,
    ProductionReportView,
    ProductionReportPDFView,
    ProductionReportExcelView,
)

from .views import ( 
    WellTestReportView,
    WellTestExcelExportView,
    WellTestPDFExportView, 
    InterventionReportView,)
from .views import (
    WellReportView,
    WellReportExcelView,
    WellReportPDFView,
)
from .views import (
    MaintenanceReportView,
    MaintenanceReportExcelView,
    MaintenanceReportPDFView,
)
from .views import (
    FieldReportView,
    FieldReportExcelView,
    FieldReportPDFView,
)
from .views import (
    MeasurementReportView,
    MeasurementReportExcelView,
    MeasurementReportPDFView,
)


urlpatterns = [
    path(
        "production/",
        ProductionReportView.as_view(),
        name="production-report",
    ),

    path(
        "production/pdf/",
        ProductionReportPDFView.as_view(),
        name="production-report-pdf",
    ),
    path(
        "production/export/excel/",
        ProductionReportExcelView.as_view(),
        name="production-report-excel",
    ),

    path(
        "well-tests/",
        WellTestReportView.as_view(),
        name="well-test-report",
    ),
    path(
        "well-tests/export/excel/",
        WellTestExcelExportView.as_view(),
        name="well-test-excel-export", 
    ),
    path(
        "well-tests/export/pdf/",
        WellTestPDFExportView.as_view(),
        name="well-test-pdf",
    ),path(
        "interventions/",
        InterventionReportView.as_view(),
        name="intervention-report",
    ),
    path(
        "interventions/export/excel/",
        InterventionReportExcelView.as_view(),
        name="intervention-report-excel",
    ),
    path(
        "interventions/export/pdf/",
        InterventionReportPDFView.as_view(),
        name="intervention-report-pdf",
    ),
    path(
        "wells/",
        WellReportView.as_view(),
        name="well-report",
    ),
    path(
        "wells/export/excel/",
        WellReportExcelView.as_view(),
        name="well-report-excel",
    ),
    path(
        "wells/export/pdf/",
        WellReportPDFView.as_view(),
        name="well-report-pdf",
    ),
    path(
        "maintenance/",
        MaintenanceReportView.as_view(),
        name="maintenance-report",
    ),
    path(
        "maintenance/export/excel/",
        MaintenanceReportExcelView.as_view(),
        name="maintenance-report-excel",
    ),
    path(
        "maintenance/export/pdf/",
        MaintenanceReportPDFView.as_view(),
        name="maintenance-report-pdf",
    ),
    path(
        "fields/",
        FieldReportView.as_view(),
        name="field-report",
    ),
    path(
        "fields/export/excel/",
        FieldReportExcelView.as_view(),
        name="field-report-excel",
    ),
    path(
        "fields/export/pdf/",
        FieldReportPDFView.as_view(),
        name="field-report-pdf",
    ),
    path(
        "measurements/",
        MeasurementReportView.as_view(),
        name="measurement-report",
    ),
    path(
        "measurements/export/excel/",
        MeasurementReportExcelView.as_view(),
        name="measurement-report-excel",
    ),
    path(
        "measurements/export/pdf/",
        MeasurementReportPDFView.as_view(),
        name="measurement-report-pdf",
    ),

]