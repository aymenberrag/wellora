from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

from core.permissions import scope_queryset_for_user

from .models import WellMeasurement
from .permissions import MeasurementPermission
from .serializers import WellMeasurementSerializer


class WellMeasurementViewSet(ModelViewSet):

    queryset = WellMeasurement.objects.all()

    serializer_class = WellMeasurementSerializer

    permission_classes = [MeasurementPermission]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "well__code",
        "well__name",
        "measurement_date",
        "operating_status",
    ]

    ordering_fields = "__all__"

    def get_queryset(self):
        return scope_queryset_for_user(self.request.user, WellMeasurement.objects.all(), "measurements")

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import DowntimeReason
from .serializers import DowntimeReasonSerializer


class DowntimeReasonViewSet(viewsets.ModelViewSet):

    queryset = DowntimeReason.objects.all()

    serializer_class = DowntimeReasonSerializer

    permission_classes = [IsAuthenticated]