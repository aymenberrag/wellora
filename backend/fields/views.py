from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.viewsets import ModelViewSet

from .models import Field
from .permissions import FieldPermission
from .serializers import FieldSerializer


class FieldViewSet(ModelViewSet):

    queryset = Field.objects.all()

    serializer_class = FieldSerializer

    permission_classes = [FieldPermission]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "name",
        "code",
    ]

    ordering_fields = "__all__"