from rest_framework.routers import DefaultRouter

from .views import WellViewSet

router = DefaultRouter()

router.register("", WellViewSet, basename="wells")

urlpatterns = router.urls