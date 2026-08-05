from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

from .models import WellIntervention
from .serializers import WellInterventionSerializer
from .permissions import InterventionPermission


class WellInterventionViewSet(ModelViewSet):

    queryset = WellIntervention.objects.all()

    serializer_class = WellInterventionSerializer

    permission_classes = [InterventionPermission]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "well__code",
        "well__name",
        "title",
        "intervention_type",
    ]

    ordering_fields = "__all__"