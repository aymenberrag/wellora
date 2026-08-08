from rest_framework.routers import DefaultRouter

from .views import (
    WellMeasurementViewSet,
    DowntimeReasonViewSet,
)

router = DefaultRouter()

router.register(
    "measurements",
    WellMeasurementViewSet,
)

router.register(
    "downtime-reasons",
    DowntimeReasonViewSet,
)

urlpatterns = router.urls