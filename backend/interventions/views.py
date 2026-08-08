from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

from core.permissions import scope_queryset_for_user

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

    def get_queryset(self):
        return scope_queryset_for_user(self.request.user, WellIntervention.objects.all(), "interventions")