from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

from core.permissions import scope_queryset_for_user

from .models import WellTest
from .serializers import WellTestSerializer
from .permissions import WellTestPermission


class WellTestViewSet(ModelViewSet):

    queryset = WellTest.objects.all()

    serializer_class = WellTestSerializer

    permission_classes = [WellTestPermission]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "well__code",
        "well__name",
        "test_date",
    ]

    ordering_fields = "__all__"

    def get_queryset(self):
        return scope_queryset_for_user(self.request.user, WellTest.objects.all(), "well_tests")