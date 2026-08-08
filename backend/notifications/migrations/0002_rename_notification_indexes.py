from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("notifications", "0001_initial"),
    ]

    operations = [
        migrations.RenameIndex(
            model_name="notification",
            old_name="notificati_user_id_2e8f22_idx",
            new_name="notificatio_user_id_f2ad08_idx",
        ),
        migrations.RenameIndex(
            model_name="notification",
            old_name="notificati_notific_4f19dd_idx",
            new_name="notificatio_notific_d874a6_idx",
        ),
        migrations.RenameIndex(
            model_name="notification",
            old_name="notificati_event_k_3b40a7_idx",
            new_name="notificatio_event_k_17dbcf_idx",
        ),
    ]
