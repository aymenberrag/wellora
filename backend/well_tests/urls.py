from rest_framework.routers import DefaultRouter

from .views import WellTestViewSet

router = DefaultRouter()

router.register("", WellTestViewSet, basename="well-tests")

urlpatterns = router.urls