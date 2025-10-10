import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shul_display.settings')

app = Celery('shul_display')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Scheduled tasks for pre-calculated zmanim system
app.conf.beat_schedule = {
    'extend-zmanim-weekly': {
        'task': 'zmanim_app.tasks.extend_all_shuls_forward',
        'schedule': crontab(hour=3, minute=0, day_of_week=0),  # Sundays 3 AM
    },
    'validate-zmanim-daily': {
        'task': 'zmanim_app.tasks.validate_zmanim_integrity',
        'schedule': crontab(hour=2, minute=0),  # Daily 2 AM
    },
    'cleanup-old-zmanim': {
        'task': 'zmanim_app.tasks.cleanup_old_zmanim',
        'schedule': crontab(minute=0),  # Every hour on the hour
    },
}