from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Notification",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("notification_type", models.CharField(choices=[("production", "Production"), ("measurement", "Measurement"), ("well", "Well"), ("maintenance", "Maintenance"), ("intervention", "Intervention"), ("well_test", "Well Test"), ("system", "System")], max_length=30)),
                ("severity", models.CharField(choices=[("info", "Info"), ("warning", "Warning"), ("critical", "Critical"), ("success", "Success")], max_length=20)),
                ("title", models.CharField(max_length=200)),
                ("message", models.TextField()),
                ("is_read", models.BooleanField(default=False)),
                ("read_at", models.DateTimeField(blank=True, null=True)),
                ("url", models.CharField(blank=True, max_length=500, null=True)),
                ("event_key", models.CharField(max_length=255)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="notifications", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ["-created_at"],
                "indexes": [
                    models.Index(fields=["user", "is_read", "-created_at"], name="notificati_user_id_2e8f22_idx"),
                    models.Index(fields=["notification_type", "-created_at"], name="notificati_notific_4f19dd_idx"),
                    models.Index(fields=["event_key"], name="notificati_event_k_3b40a7_idx"),
                ],
                "constraints": [models.UniqueConstraint(fields=("user", "event_key"), name="unique_user_notification_event")],
            },
        ),
    ]
