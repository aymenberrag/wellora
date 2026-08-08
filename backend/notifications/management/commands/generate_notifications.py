from django.core.management.base import BaseCommand

from notifications.services import generate_operational_notifications


class Command(BaseCommand):
    help = "Generate deduplicated Wellora operational notifications."

    def handle(self, *args, **options):
        generate_operational_notifications()
        self.stdout.write(self.style.SUCCESS("Operational notifications generated."))
