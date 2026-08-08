from datetime import timedelta

from django.conf import settings
from django.core.cache import cache
from django.db import IntegrityError
from django.utils import timezone

from interventions.models import WellIntervention
from maintenance.models import Maintenance
from measurements.models import WellMeasurement
from notifications.models import Notification
from production.models import Production
from well_tests.models import WellTest
from wells.models import Well


GENERATION_CACHE_KEY = "wellora_notification_generation"

ROLE_CATEGORIES = {
    "production": {"SUPER_ADMIN", "COMPANY_ADMIN", "PRODUCTION_ENGINEER", "FIELD_OPERATOR", "VIEWER"},
    "measurement": {"SUPER_ADMIN", "COMPANY_ADMIN", "PRODUCTION_ENGINEER", "FIELD_OPERATOR", "VIEWER"},
    "well": {"SUPER_ADMIN", "COMPANY_ADMIN", "PRODUCTION_ENGINEER", "FIELD_OPERATOR", "VIEWER"},
    "well_test": {"SUPER_ADMIN", "COMPANY_ADMIN", "PRODUCTION_ENGINEER", "FIELD_OPERATOR", "VIEWER"},
    "maintenance": {"SUPER_ADMIN", "COMPANY_ADMIN", "MAINTENANCE_ENGINEER", "FIELD_OPERATOR", "VIEWER"},
    "intervention": {"SUPER_ADMIN", "COMPANY_ADMIN", "MAINTENANCE_ENGINEER", "FIELD_OPERATOR", "VIEWER"},
}


def _recipient_users(company_id, notification_type):
    from accounts.models import User

    roles = ROLE_CATEGORIES.get(notification_type, {"SUPER_ADMIN", "COMPANY_ADMIN"})
    users = User.objects.filter(is_active=True, role__in=roles)
    if company_id is not None:
        users = users.filter(company_id=company_id) | users.filter(is_superuser=True)
    else:
        users = users.filter(is_superuser=True) | users.filter(company_id__isnull=True)
    return users.distinct()


def _create_for_scope(*, company_id, notification_type, severity, title, message, event_key, url):
    for user in _recipient_users(company_id, notification_type):
        try:
            Notification.objects.get_or_create(
                user=user,
                event_key=event_key,
                defaults={
                    "notification_type": notification_type,
                    "severity": severity,
                    "title": title,
                    "message": message,
                    "url": url,
                },
            )
        except IntegrityError:
            continue


def _generate_production_notifications():
    threshold = float(getattr(settings, "WELLORA_PRODUCTION_DECLINE_THRESHOLD", 15.0))
    well_ids = Production.objects.values_list("well_id", flat=True).distinct()
    for well_id in well_ids:
        records = list(Production.objects.select_related("well__operator").filter(well_id=well_id).order_by("-production_date")[:2])
        if len(records) < 2:
            continue
        latest, previous = records
        previous_oil = float(previous.oil_production or 0)
        latest_oil = float(latest.oil_production or 0)
        if previous_oil <= 0:
            continue
        decline = ((previous_oil - latest_oil) / previous_oil) * 100
        if decline >= threshold:
            _create_for_scope(
                company_id=latest.well.operator_id,
                notification_type=Notification.NotificationType.PRODUCTION,
                severity=Notification.Severity.WARNING,
                title="Production Decline",
                message=f"{latest.well.code} oil production decreased by {decline:.1f}% compared with the previous record.",
                event_key=f"production_decline:{latest.well_id}:{latest.production_date}",
                url="/production",
            )


def _generate_measurement_notifications():
    limits = getattr(settings, "WELLORA_MEASUREMENT_LIMITS", {})
    pressure = limits.get("wellhead_pressure", {"min": 0, "max": 2000})
    temperature = limits.get("wellhead_temperature", {"min": -20, "max": 150})
    motor_current = limits.get("motor_current", {"min": 0, "max": 500})
    esp_frequency = limits.get("esp_frequency", {"min": 0, "max": 100})

    measurements = WellMeasurement.objects.select_related("well__operator").order_by("-measurement_date", "-created_at")[:200]
    for measurement in measurements:
        checks = [
            (measurement.wellhead_pressure, pressure, "wellhead pressure", "psi"),
            (measurement.wellhead_temperature, temperature, "wellhead temperature", "°C"),
            (measurement.motor_current, motor_current, "motor current", "A"),
            (measurement.esp_frequency, esp_frequency, "ESP frequency", "Hz"),
        ]
        for value, bounds, label, unit in checks:
            if value is None:
                continue
            numeric = float(value)
            if numeric < bounds["min"] or numeric > bounds["max"]:
                _create_for_scope(
                    company_id=measurement.well.operator_id,
                    notification_type=Notification.NotificationType.MEASUREMENT,
                    severity=Notification.Severity.CRITICAL,
                    title="Abnormal Measurement",
                    message=f"{measurement.well.code} {label} is {numeric:g} {unit}, outside the configured operating range.",
                    event_key=f"measurement_limit:{measurement.id}:{label.replace(' ', '_')}",
                    url="/measurements",
                )


def _generate_maintenance_notifications():
    today = timezone.localdate()
    due_window = int(getattr(settings, "WELLORA_MAINTENANCE_DUE_DAYS", 2))
    upcoming_end = today + timedelta(days=due_window)
    records = Maintenance.objects.select_related("well__operator").filter(
        status__in=[Maintenance.Status.PLANNED, Maintenance.Status.IN_PROGRESS],
        start_date__lte=upcoming_end,
    )
    for item in records:
        category = "overdue" if item.start_date < today else "due"
        severity = Notification.Severity.CRITICAL if category == "overdue" else Notification.Severity.WARNING
        message = f"{item.title} for {item.well.code} is overdue." if category == "overdue" else f"{item.title} for {item.well.code} is due on {item.start_date}."
        _create_for_scope(
            company_id=item.well.operator_id,
            notification_type=Notification.NotificationType.MAINTENANCE,
            severity=severity,
            title="Maintenance Overdue" if category == "overdue" else "Maintenance Due",
            message=message,
            event_key=f"maintenance_{category}:{item.id}:{item.start_date}",
            url="/maintenance",
        )

    recent = Maintenance.objects.select_related("well__operator").filter(
        status=Maintenance.Status.COMPLETED,
        updated_at__gte=timezone.now() - timedelta(days=7),
    )
    for item in recent:
        _create_for_scope(
            company_id=item.well.operator_id,
            notification_type=Notification.NotificationType.MAINTENANCE,
            severity=Notification.Severity.SUCCESS,
            title="Maintenance Completed",
            message=f"{item.title} on {item.well.code} was completed successfully.",
            event_key=f"maintenance_completed:{item.id}:{item.updated_at.date()}",
            url="/maintenance",
        )


def _generate_intervention_notifications():
    recent = WellIntervention.objects.select_related("well__operator").filter(
        updated_at__gte=timezone.now() - timedelta(days=14),
        status__in=[
            WellIntervention.Status.IN_PROGRESS,
            WellIntervention.Status.COMPLETED,
            WellIntervention.Status.CANCELLED,
        ],
    )
    for item in recent:
        title_map = {
            WellIntervention.Status.IN_PROGRESS: "Intervention Started",
            WellIntervention.Status.COMPLETED: "Intervention Completed",
            WellIntervention.Status.CANCELLED: "Intervention Cancelled",
        }
        severity_map = {
            WellIntervention.Status.IN_PROGRESS: Notification.Severity.INFO,
            WellIntervention.Status.COMPLETED: Notification.Severity.SUCCESS,
            WellIntervention.Status.CANCELLED: Notification.Severity.CRITICAL,
        }
        _create_for_scope(
            company_id=item.well.operator_id,
            notification_type=Notification.NotificationType.INTERVENTION,
            severity=severity_map[item.status],
            title=title_map[item.status],
            message=f"{item.intervention_type} on {item.well.code} is {item.status.lower()}.",
            event_key=f"intervention_status:{item.id}:{item.status}:{item.updated_at.date()}",
            url="/interventions",
        )


def _generate_well_notifications():
    recent = Well.objects.select_related("operator").filter(
        updated_at__gte=timezone.now() - timedelta(days=7),
        status__in=[Well.Status.SHUT_IN, Well.Status.PRODUCING, Well.Status.WORKOVER, Well.Status.ABANDONED],
    )
    for well in recent:
        _create_for_scope(
            company_id=well.operator_id,
            notification_type=Notification.NotificationType.WELL,
            severity=Notification.Severity.WARNING if well.status != Well.Status.PRODUCING else Notification.Severity.SUCCESS,
            title="Well Status Changed",
            message=f"{well.code} is now {well.status}.",
            event_key=f"well_status:{well.id}:{well.status}:{well.updated_at.date()}",
            url="/wells",
        )


def _generate_well_test_notifications():
    limits = getattr(settings, "WELLORA_WELL_TEST_LIMITS", {"water_cut": 80, "gor": 2000})
    recent = WellTest.objects.select_related("well__operator").filter(
        test_date__gte=timezone.localdate() - timedelta(days=14),
    )
    for test in recent:
        checks = [(test.water_cut, limits.get("water_cut"), "water cut"), (test.gor, limits.get("gor"), "GOR")]
        for value, limit, label in checks:
            if value is not None and limit is not None and float(value) > float(limit):
                _create_for_scope(
                    company_id=test.well.operator_id,
                    notification_type=Notification.NotificationType.WELL_TEST,
                    severity=Notification.Severity.WARNING,
                    title="Well Test Anomaly",
                    message=f"{test.well.code} {label} is {float(value):g}, above the configured limit.",
                    event_key=f"well_test_limit:{test.id}:{label.replace(' ', '_')}",
                    url="/well-tests",
                )


def generate_operational_notifications():
    if not cache.add(GENERATION_CACHE_KEY, True, timeout=30):
        return
    _generate_production_notifications()
    _generate_measurement_notifications()
    _generate_maintenance_notifications()
    _generate_intervention_notifications()
    _generate_well_notifications()
    _generate_well_test_notifications()
