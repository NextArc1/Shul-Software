from celery import shared_task
from datetime import date, timedelta
import logging
from .models import Shul, DailyZmanim
from .zmanim_calculator import ZmanimCalculator
from django.core.mail import send_mail
from django.conf import settings

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


# ========== EMAIL TASKS (Async to prevent blocking) ==========

@shared_task
def send_registration_confirmation_email(registration_id):
    """
    Send confirmation email after registration request is submitted.
    Runs asynchronously to avoid blocking the HTTP response.
    """
    from .models import PendingRegistration

    try:
        registration = PendingRegistration.objects.get(id=registration_id)

        subject = 'Registration Request Received - Shul Schedule'
        message = f"""Hello {registration.contact_name},

Thank you for your interest in Shul Schedule!

We have received your registration request for {registration.organization_name} and are currently reviewing it. We carefully review each application to ensure the quality of our service.

What happens next?
• We will review your request within 1-2 business days
• If approved, you'll receive an email with a link to complete your account setup
• Once your account is created, you can immediately start using the scheduling software

Best regards,
Shua P
Shul Schedule

---
Request Details:
Organization: {registration.organization_name}
Contact: {registration.contact_name}
Email: {registration.email}
"""

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [registration.email],
            fail_silently=False,
        )
        logger.info(f"Confirmation email sent successfully to {registration.email}")
        return f"Email sent to {registration.email}"

    except PendingRegistration.DoesNotExist:
        logger.error(f"Registration {registration_id} not found")
        return f"Registration {registration_id} not found"
    except Exception as e:
        logger.error(f"Failed to send confirmation email for registration {registration_id}: {e}")
        return f"Failed: {str(e)}"


@shared_task
def send_admin_registration_notification(registration_id):
    """
    Send notification email to admin when a new registration request is submitted.
    Runs asynchronously to avoid blocking the HTTP response.
    """
    from .models import PendingRegistration

    try:
        registration = PendingRegistration.objects.get(id=registration_id)

        subject = f'New Registration Request - {registration.organization_name}'
        message = f"""A new registration request has been submitted and is pending review.

Organization Details:
-------------------
Organization Name: {registration.organization_name}
Contact Name: {registration.contact_name}
Rabbi: {registration.rabbi or 'N/A'}
Email: {registration.email}
Phone: {registration.phone}

Address:
{registration.street_address}
{registration.city}, {registration.state} {registration.zip_code}
{registration.country}

Purpose:
{registration.purpose}

Submitted At: {registration.submitted_at.strftime('%Y-%m-%d %H:%M:%S UTC')}

---
To review and approve/reject this request, log in to the Master Admin Dashboard:
{settings.SITE_URL}/master-admin

Request ID: {registration.id}
"""

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            ['shulscheduleapp@gmail.com'],
            fail_silently=False,
        )
        logger.info(f"Admin notification sent for registration {registration.organization_name}")
        return f"Admin notification sent"

    except PendingRegistration.DoesNotExist:
        logger.error(f"Registration {registration_id} not found")
        return f"Registration {registration_id} not found"
    except Exception as e:
        logger.error(f"Failed to send admin notification for registration {registration_id}: {e}")
        return f"Failed: {str(e)}"


@shared_task
def send_approval_email(registration_id):
    """
    Send approval email with registration link.
    Runs asynchronously to avoid blocking the HTTP response.
    """
    from .models import PendingRegistration

    try:
        registration = PendingRegistration.objects.get(id=registration_id)

        registration_url = f"{settings.SITE_URL}/register/complete/{registration.approval_token}"

        subject = 'Shul Schedule Registration - Next Steps'
        message = f"""Hello {registration.contact_name},

Thank you for your interest in Shul Schedule. Your registration request for
  {registration.organization_name} has been approved.

  To complete your account setup, please visit:
  {registration_url}

  This setup link will expire in 7 days. Once you complete the setup, you will be able to:

  • Customize your display settings and appearance
  • Set your location for accurate zmanim calculations
  • Add custom times and announcements
  • Access your unique display URL

Best regards,
Shua P
Shul Schedule

---
Organization: {registration.organization_name}
Contact: {registration.contact_name}
Email: {registration.email}
"""

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [registration.email],
            fail_silently=False,
        )
        logger.info(f"Approval email sent successfully to {registration.email}")
        return f"Approval email sent to {registration.email}"

    except PendingRegistration.DoesNotExist:
        logger.error(f"Registration {registration_id} not found")
        return f"Registration {registration_id} not found"
    except Exception as e:
        logger.error(f"Failed to send approval email for registration {registration_id}: {e}")
        return f"Failed: {str(e)}"


@shared_task
def send_welcome_email(user_id, shul_id):
    """
    Send welcome email after account creation.
    Runs asynchronously to avoid blocking the HTTP response.
    """
    from django.contrib.auth import get_user_model
    from .models import Shul

    User = get_user_model()

    try:
        user = User.objects.get(id=user_id)
        shul = Shul.objects.get(id=shul_id)

        display_url = f"{settings.SITE_URL}/display/{shul.slug}"
        dashboard_url = f"{settings.SITE_URL}/setup"

        subject = 'Welcome to Shul Schedule!'
        message = f"""Hello {user.email},

Welcome to Shul Schedule! Your account has been successfully created.

Your display is now live and ready to customize:
🔗 Display URL: {display_url}

Next Steps:
1. Complete your setup in the dashboard: {dashboard_url}
2. Set your location (zip code) for accurate zmanim
3. Customize your display appearance
4. Add custom times and texts if needed

Getting Started Tips:
• We recommend using a PC with a screen or monitor for optimal viewing
• All zmanim are calculated automatically based on your location
• You can customize colors, fonts, and layout in the Settings

Best regards,
Shua P
Shul Schedule

---
Account Details:
Organization: {shul.name}
Email: {user.email}
Display URL: {display_url}
"""

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        logger.info(f"Welcome email sent successfully to {user.email}")
        return f"Welcome email sent to {user.email}"

    except User.DoesNotExist:
        logger.error(f"User {user_id} not found")
        return f"User {user_id} not found"
    except Shul.DoesNotExist:
        logger.error(f"Shul {shul_id} not found")
        return f"Shul {shul_id} not found"
    except Exception as e:
        logger.error(f"Failed to send welcome email for user {user_id}: {e}")
        return f"Failed: {str(e)}"
