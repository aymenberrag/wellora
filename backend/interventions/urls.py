from rest_framework.routers import DefaultRouter

from .views import WellInterventionViewSet

router = DefaultRouter()

router.register("", WellInterventionViewSet, basename="interventions")

urlpatterns = router.urls