from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("notifications", "0002_rename_notification_indexes"),
    ]

    operations = [
        migrations.RenameIndex(
            model_name="notification",
            old_name="notificatio_notific_d874a6_idx",
            new_name="notificatio_notific_d8746a_idx",
        ),
    ]
