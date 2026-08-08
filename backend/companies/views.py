from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter

from core.permissions import scope_queryset_for_user

from .models import Company
from .serializers import CompanySerializer
from .permissions import CompanyPermission


class CompanyViewSet(ModelViewSet):

    serializer_class = CompanySerializer
    permission_classes = [CompanyPermission]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "name",
        "city",
        "country",
    ]

    ordering_fields = "__all__"

    def get_queryset(self):
        return scope_queryset_for_user(self.request.user, Company.objects.all(), "companies")