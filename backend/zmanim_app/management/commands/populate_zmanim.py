from django.core.management.base import BaseCommand
from datetime import date, timedelta
from zmanim_app.models import Shul
from zmanim_app.zmanim_calculator import ZmanimCalculator


class Command(BaseCommand):
    help = 'Pre-calculate and populate zmanim for all or specific shuls'

    def add_arguments(self, parser):
        parser.add_argument(
            '--shul-id',
            type=int,
            help='Calculate for a specific shul ID',
        )
        parser.add_argument(
            '--all-shuls',
            action='store_true',
            help='Calculate for all active shuls',
        )
        parser.add_argument(
            '--months',
            type=int,
            default=6,
            help='Number of months to calculate (default: 6)',
        )

    def handle(self, *args, **options):
        shul_id = options.get('shul_id')
        all_shuls = options.get('all_shuls')
        months = options.get('months')

        if shul_id:
            # Calculate for single shul
            try:
                shul = Shul.objects.get(id=shul_id)
                self.stdout.write(f"Calculating {months} months of zmanim for {shul.name}...")

                start_date = date.today()
                end_date = start_date + timedelta(days=months * 30)

                count = ZmanimCalculator.calculate_date_range(shul, start_date, end_date)
                self.stdout.write(self.style.SUCCESS(f"SUCCESS: Created {count} records for {shul.name}"))

            except Shul.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Shul with ID {shul_id} not found"))

        elif all_shuls:
            # Calculate for all active shuls
            shuls = Shul.objects.filter(is_active=True)
            total_shuls = shuls.count()

            self.stdout.write(f"Calculating {months} months of zmanim for {total_shuls} shuls...")

            start_date = date.today()
            end_date = start_date + timedelta(days=months * 30)

            for index, shul in enumerate(shuls, 1):
                self.stdout.write(f"[{index}/{total_shuls}] Processing {shul.name}...")
                try:
                    count = ZmanimCalculator.calculate_date_range(shul, start_date, end_date)
                    self.stdout.write(self.style.SUCCESS(f"  SUCCESS: Created {count} records"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  ERROR: {str(e)}"))

            self.stdout.write(self.style.SUCCESS(f"\nSUCCESS: Completed processing {total_shuls} shuls"))

        else:
            self.stdout.write(self.style.ERROR("Please specify --shul-id or --all-shuls"))
