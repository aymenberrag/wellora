from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from companies.models import Company
from fields.models import Field
from wells.models import Well


class RBACSecurityTests(APITestCase):
    def setUp(self):
        self.company_a = Company.objects.create(
            name="Alpha Energy",
            short_name="ALPHA",
            company_type=Company.CompanyType.OIL_COMPANY,
        )
        self.company_b = Company.objects.create(
            name="Beta Energy",
            short_name="BETA",
            company_type=Company.CompanyType.OIL_COMPANY,
        )

        self.viewer = User.objects.create_user(
            username="viewer01",
            password="Secret123!",
            first_name="Viewer",
            last_name="User",
            role=User.Role.VIEWER,
            company=self.company_a,
            is_active=True,
        )
        self.admin = User.objects.create_user(
            username="admin01",
            password="Secret123!",
            first_name="Admin",
            last_name="User",
            role=User.Role.COMPANY_ADMIN,
            company=self.company_a,
            is_active=True,
        )

        self.field_b = Field.objects.create(
            name="North Field",
            code="NF-001",
            operator=self.company_b,
            status=Field.Status.ACTIVE,
        )
        self.well_b = Well.objects.create(
            code="WELL-002",
            name="Well B",
            field=self.field_b,
            operator=self.company_b,
            well_type=Well.WellType.OIL,
            status=Well.Status.PRODUCING,
        )

    def test_unauthenticated_request_is_rejected(self):
        response = self.client.get(reverse("companies-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_viewer_cannot_delete_well(self):
        self.client.force_authenticate(self.viewer)
        response = self.client.delete(reverse("wells-detail", args=[self.well_b.id]))
        self.assertIn(response.status_code, {status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND})

    def test_user_cannot_access_another_company_well(self):
        self.client.force_authenticate(self.viewer)
        response = self.client.get(reverse("wells-detail", args=[self.well_b.id]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_inactive_user_cannot_authenticate(self):
        inactive = User.objects.create_user(
            username="inactive01",
            password="Secret123!",
            first_name="Inactive",
            last_name="User",
            role=User.Role.VIEWER,
            company=self.company_a,
            is_active=False,
        )
        response = self.client.post(
            reverse("login"),
            {"employee_id": inactive.username, "password": "Secret123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_company_admin_can_manage_same_company_user(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post(
            reverse("users-list"),
            {
                "username": "newuser01",
                "password": "Secret123!",
                "first_name": "New",
                "last_name": "User",
                "email": "new@example.com",
                "role": User.Role.VIEWER,
                "company": self.company_a.id,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
