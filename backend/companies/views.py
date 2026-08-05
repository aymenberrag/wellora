from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter

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

        user = self.request.user

        if user.is_superuser:
            return Company.objects.all()

        if user.role == user.Role.COMPANY_ADMIN:
            return Company.objects.filter(id=user.company_id)

        return Company.objects.all()