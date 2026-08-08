from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.viewsets import ModelViewSet

from core.permissions import scope_queryset_for_user

from .models import Production
from .serializers import ProductionSerializer
from .permissions import ProductionPermission


class ProductionViewSet(ModelViewSet):

    queryset = Production.objects.all()

    serializer_class = ProductionSerializer

    permission_classes = [ProductionPermission]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "well__code",
        "well__name",
        "production_date",
    ]

    ordering_fields = "__all__"

    def get_queryset(self):
        return scope_queryset_for_user(self.request.user, Production.objects.all(), "production")