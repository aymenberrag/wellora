from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

from .models import Maintenance
from .serializers import MaintenanceSerializer
from .permissions import MaintenancePermission


class MaintenanceViewSet(ModelViewSet):

    queryset = Maintenance.objects.all()

    serializer_class = MaintenanceSerializer

    permission_classes = [MaintenancePermission]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "well__code",
        "well__name",
        "title",
    ]

    ordering_fields = "__all__"