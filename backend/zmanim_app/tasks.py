from celery import shared_task
from datetime import date, timedelta
import logging
from .models import Shul, DailyZmanim
from .zmanim_calculator import ZmanimCalculator

logger = logging.getLogger(__name__)


@shared_task
def extend_all_shuls_forward():
    """
    Weekly task to extend zmanim calculations to ensure 6 months from today
    Maintains a rolling 6-month buffer even if task hasn't run for a while
    """
    shuls = Shul.objects.filter(is_active=True)
    logger.info(f"Extending zmanim for {shuls.count()} active shuls")

    today = date.today()
    target_end_date = today + timedelta(days=180)  # 6 months from today

    for shul in shuls:
        try:
            # Find last date we have data for
            last_record = DailyZmanim.objects.filter(shul=shul).order_by('-date').first()

            if last_record and last_record.date >= target_end_date:
                # Already have 6 months of data
                logger.info(f"{shul.name}: Already has 6 months of data (last date: {last_record.date})")
                continue

            if last_record:
                start_date = last_record.date + timedelta(days=1)
                days_to_add = (target_end_date - last_record.date).days
            else:
                # No data exists, start from today
                start_date = today
                days_to_add = 180

            # Calculate missing zmanim up to 6 months from today
            count = ZmanimCalculator.calculate_date_range(shul, start_date, target_end_date)
            logger.info(f"Extended {shul.name}: added {count} days (was missing {days_to_add} days)")

        except Exception as e:
            logger.error(f"Error extending {shul.name}: {str(e)}")

    return f"Extended {shuls.count()} shuls to 6 months from today"


@shared_task
def validate_zmanim_integrity():
    """
    Daily validation to ensure all shuls have data for next 6 months
    Auto-fills any gaps
    """
    shuls = Shul.objects.filter(is_active=True)
    target_date = date.today() + timedelta(days=180)  # 6 months ahead

    issues_found = 0

    for shul in shuls:
        last_record = DailyZmanim.objects.filter(shul=shul).order_by('-date').first()

        if not last_record or last_record.date < target_date:
            logger.warning(f"Shul {shul.name} missing data, auto-filling...")

            start = last_record.date + timedelta(days=1) if last_record else date.today()
            ZmanimCalculator.calculate_date_range(shul, start, target_date)
            issues_found += 1

    logger.info(f"Validation complete. Fixed {issues_found} shuls.")
    return f"Validated {shuls.count()} shuls, fixed {issues_found}"


@shared_task
def cleanup_old_zmanim():
    """
    Hourly cleanup task that deletes past zmanim for each shul based on their timezone.
    Runs every hour and checks if it's past midnight in each shul's timezone.
    """
    from datetime import datetime
    import pytz

    shuls = Shul.objects.filter(is_active=True)
    total_deleted = 0

    for shul in shuls:
        try:
            # Get current time in the shul's timezone
            tz = pytz.timezone(shul.timezone)
            shul_now = datetime.now(tz)
            shul_today = shul_now.date()

            # Delete all records before today in this shul's timezone
            deleted_count, _ = DailyZmanim.objects.filter(
                shul=shul,
                date__lt=shul_today
            ).delete()

            if deleted_count > 0:
                logger.info(f"Cleaned up {deleted_count} old records for {shul.name} (timezone: {shul.timezone}, local date: {shul_today})")
                total_deleted += deleted_count

        except Exception as e:
            logger.error(f"Error cleaning up {shul.name}: {str(e)}")

    if total_deleted > 0:
        logger.info(f"Total cleanup: deleted {total_deleted} old records across all shuls")

    return f"Deleted {total_deleted} old records across all shuls"


@shared_task
def recalculate_shul_zmanim(shul_id, from_date=None):
    """
    Recalculate zmanim for a shul (e.g., after coordinate change)

    Args:
        shul_id: Shul ID
        from_date: Start date (defaults to today)
    """
    try:
        shul = Shul.objects.get(id=shul_id)

        if from_date is None:
            from_date = date.today()
        elif isinstance(from_date, str):
            from_date = date.fromisoformat(from_date)

        # Delete existing records from this date forward
        DailyZmanim.objects.filter(shul=shul, date__gte=from_date).delete()

        # Recalculate 6 months forward
        end_date = from_date + timedelta(days=180)
        count = ZmanimCalculator.calculate_date_range(shul, from_date, end_date)

        logger.info(f"Recalculated {count} days for {shul.name}")
        return f"Recalculated {count} days"

    except Shul.DoesNotExist:
        logger.error(f"Shul {shul_id} not found")
        return f"Shul {shul_id} not found"
