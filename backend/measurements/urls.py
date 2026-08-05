from rest_framework.routers import DefaultRouter

from .views import WellMeasurementViewSet

router = DefaultRouter()

router.register("", WellMeasurementViewSet, basename="measurements")

urlpatterns = router.urls