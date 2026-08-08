from django.urls import path

from .views import (
    InterventionReportExcelView,
    InterventionReportPDFView,
    ProductionReportView,
    ProductionReportPDFView,
)

from .views import ( 
    WellTestReportView,
    WellTestExcelExportView,
    WellTestPDFExportView, 
    InterventionReportView,)


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

]