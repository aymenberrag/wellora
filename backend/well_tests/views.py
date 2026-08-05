from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

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