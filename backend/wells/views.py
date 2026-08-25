from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

from core.permissions import scope_queryset_for_user

from .models import Well
from .serializers import WellSerializer
from .permissions import WellPermission


class WellViewSet(ModelViewSet):

    queryset = Well.objects.all()

    serializer_class = WellSerializer

    permission_classes = [WellPermission]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "code",
        "name",
        "api_number",
    ]

    ordering_fields = "__all__"

    def get_queryset(self):
        queryset = scope_queryset_for_user(self.request.user, Well.objects.all(), "wells")

        params = self.request.query_params

        field = params.get("field")
        if field:
            queryset = queryset.filter(field_id=field)

        status_param = params.get("status")
        if status_param and status_param != "All":
            queryset = queryset.filter(status=status_param)

        well_type = params.get("well_type")
        if well_type and well_type != "All":
            queryset = queryset.filter(well_type=well_type)

        artificial_lift = params.get("artificial_lift")
        if artificial_lift and artificial_lift != "All":
            queryset = queryset.filter(artificial_lift=artificial_lift)

        has_coordinates = params.get("has_coordinates")
        if has_coordinates in ("true", "1"):
            queryset = queryset.exclude(latitude__isnull=True).exclude(longitude__isnull=True)

        return queryset