from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

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