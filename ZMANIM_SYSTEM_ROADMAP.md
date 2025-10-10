# Shul Display System - Zmanim Pre-calculation Roadmap

## Overview

This document outlines the plan to transform the Shul Display System from a daily calculation approach to a robust pre-calculated system. The core focus is on **calculating zmanim 6 months in advance** and storing them in a database table for instant retrieval.

---

## 🎯 Core Goal

**Replace daily calculations with pre-calculated data stored in a database.**

### Current System (❌ Problems):
```
Daily 2AM → Celery Task → Calculate Zmanim → Update Shul Model → Display
```
- ❌ Single point of failure (if task fails, display breaks)
- ❌ No historical or future data
- ❌ Learning schedules not integrated in daily updates
- ❌ Coordinate changes require manual recalculation
- ❌ Performance bottlenecks during calculations

### New System (✅ Solution):
```
One-time → Calculate 6 months → Store in DailyZmanim table → Quick database query → Display
```
- ✅ 99.9% uptime (no daily calculation failures)
- ✅ Lightning fast (single database query)
- ✅ See weeks/months ahead
- ✅ Learning schedules included automatically
- ✅ Recalculation only when needed

---

## Storage Analysis

| Scale | 6 Months | 1 Year | Storage Cost/Month |
|-------|----------|--------|--------------------|
| 1,000 shuls | 57.6 MB | 117 MB | $0.013 |
| 10,000 shuls | 576 MB | 1.17 GB | $0.13 |
| 100,000 shuls | 5.76 GB | 11.7 GB | $1.35 |

*Storage is essentially free compared to daily calculation infrastructure costs.*

---

## Implementation Roadmap

## Phase 1: Database Schema & Models

### 1.1 Create DailyZmanim Table

**SQL Schema:**
```sql
CREATE TABLE daily_zmanim (
    id SERIAL PRIMARY KEY,
    shul_id INTEGER REFERENCES shul(id) ON DELETE CASCADE,
    date DATE NOT NULL,

    -- Zmanim times (14 fields)
    alos_time TIME,
    hanetz_time TIME,
    chatzos_time TIME,
    mincha_gedola_time TIME,
    mincha_ketana_time TIME,
    plag_hamincha_time TIME,
    shkia_time TIME,
    tzais_time TIME,
    tzais_72_time TIME,
    sof_zman_krias_shema_gra_time TIME,
    sof_zman_krias_shema_mga_time TIME,
    sof_zman_tfila_gra_time TIME,
    sof_zman_tfila_mga_time TIME,
    candle_lighting_time TIME,

    -- Learning schedule (5 fields)
    parsha VARCHAR(100),
    daf_yomi_bavli VARCHAR(100),
    mishna_yomis VARCHAR(100),
    tehillim_monthly VARCHAR(100),
    daf_yomi_yerushalmi VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(shul_id, date)
);

-- Critical index for fast lookups
CREATE INDEX idx_daily_zmanim_shul_date ON daily_zmanim(shul_id, date);
```

### 1.2 Django Model

**File: `backend/zmanim_app/models.py`** (add this model)

```python
class DailyZmanim(models.Model):
    """Pre-calculated zmanim for a specific shul on a specific date"""
    shul = models.ForeignKey('Shul', on_delete=models.CASCADE, related_name='daily_zmanim')
    date = models.DateField()

    # Zmanim times
    alos = models.TimeField(null=True, blank=True)
    hanetz = models.TimeField(null=True, blank=True)
    chatzos = models.TimeField(null=True, blank=True)
    mincha_gedola = models.TimeField(null=True, blank=True)
    mincha_ketana = models.TimeField(null=True, blank=True)
    plag_hamincha = models.TimeField(null=True, blank=True)
    shkia = models.TimeField(null=True, blank=True)
    tzais = models.TimeField(null=True, blank=True)
    tzais_72 = models.TimeField(null=True, blank=True)
    sof_zman_krias_shema_gra = models.TimeField(null=True, blank=True)
    sof_zman_krias_shema_mga = models.TimeField(null=True, blank=True)
    sof_zman_tfila_gra = models.TimeField(null=True, blank=True)
    sof_zman_tfila_mga = models.TimeField(null=True, blank=True)
    candle_lighting = models.TimeField(null=True, blank=True)

    # Learning schedule
    parsha = models.CharField(max_length=100, blank=True)
    daf_yomi_bavli = models.CharField(max_length=100, blank=True)
    mishna_yomis = models.CharField(max_length=100, blank=True)
    tehillim_monthly = models.CharField(max_length=100, blank=True)
    daf_yomi_yerushalmi = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['shul', 'date']
        ordering = ['date']
        indexes = [
            models.Index(fields=['shul', 'date']),
        ]

    def __str__(self):
        return f"{self.shul.name} - {self.date}"

    @classmethod
    def get_for_date(cls, shul, date):
        """Get zmanim for a specific date"""
        return cls.objects.filter(shul=shul, date=date).first()

    @classmethod
    def get_range(cls, shul, start_date, end_date):
        """Get zmanim for a date range"""
        return cls.objects.filter(shul=shul, date__range=[start_date, end_date])
```

### 1.3 Migration Strategy

**Keep old fields temporarily for zero-downtime migration:**

1. ✅ Create `DailyZmanim` model alongside existing `Shul` zmanim fields
2. ✅ Populate `DailyZmanim` with 6 months of data
3. ✅ Switch APIs to read from `DailyZmanim`
4. ✅ Verify everything works for 1-2 weeks
5. ✅ Remove old fields from `Shul` model

---

## Phase 2: Calculation Engine Enhancement

### 2.1 Batch Calculation Functions

**File: `backend/zmanim_app/zmanim_calculator.py`** (new file)

```python
from datetime import date, timedelta
from .models import Shul, DailyZmanim
from .get_daily_zmanim import get_daily_zmanim
from .custom_zmanim_calculations import get_custom_zmanim
import logging

logger = logging.getLogger(__name__)


class ZmanimCalculator:
    """Calculate and store zmanim for date ranges"""

    @staticmethod
    def calculate_date_range(shul, start_date, end_date):
        """
        Calculate zmanim for a date range and bulk insert to database

        Args:
            shul: Shul model instance
            start_date: datetime.date
            end_date: datetime.date

        Returns:
            Number of records created
        """
        logger.info(f"Calculating zmanim for {shul.name} from {start_date} to {end_date}")

        records_to_create = []
        current_date = start_date

        while current_date <= end_date:
            # Calculate zmanim for this date
            zmanim = get_daily_zmanim(
                shul.latitude,
                shul.longitude,
                shul.timezone,
                target_date=current_date,
                name=shul.name
            )

            # Calculate learning schedule
            limudim = get_custom_zmanim(current_date, in_israel=False)

            # Create DailyZmanim record
            daily_zmanim = DailyZmanim(
                shul=shul,
                date=current_date,
                alos=zmanim['alos'].time() if zmanim.get('alos') else None,
                hanetz=zmanim['hanetz'].time() if zmanim.get('hanetz') else None,
                chatzos=zmanim['chatzos'].time() if zmanim.get('chatzos') else None,
                mincha_gedola=zmanim['mincha_gedola'].time() if zmanim.get('mincha_gedola') else None,
                mincha_ketana=zmanim['mincha_ketana'].time() if zmanim.get('mincha_ketana') else None,
                plag_hamincha=zmanim['plag_hamincha'].time() if zmanim.get('plag_hamincha') else None,
                shkia=zmanim['shkia'].time() if zmanim.get('shkia') else None,
                tzais=zmanim['tzais'].time() if zmanim.get('tzais') else None,
                tzais_72=zmanim['tzais_72'].time() if zmanim.get('tzais_72') else None,
                sof_zman_krias_shema_gra=zmanim['sof_zman_krias_shema_gra'].time() if zmanim.get('sof_zman_krias_shema_gra') else None,
                sof_zman_krias_shema_mga=zmanim['sof_zman_krias_shema_mga'].time() if zmanim.get('sof_zman_krias_shema_mga') else None,
                sof_zman_tfila_gra=zmanim['sof_zman_tfila_gra'].time() if zmanim.get('sof_zman_tfila_gra') else None,
                sof_zman_tfila_mga=zmanim['sof_zman_tfila_mga'].time() if zmanim.get('sof_zman_tfila_mga') else None,
                candle_lighting=zmanim['candle_lighting'].time() if zmanim.get('candle_lighting') else None,
                parsha=limudim.get('parsha', ''),
                daf_yomi_bavli=limudim.get('dafyomibavli', ''),
                mishna_yomis=limudim.get('mishnayomis', ''),
                tehillim_monthly=limudim.get('tehillimmonthly', ''),
                daf_yomi_yerushalmi=limudim.get('DafYomiYerushalmi', ''),
            )

            records_to_create.append(daily_zmanim)
            current_date += timedelta(days=1)

        # Bulk insert (much faster than individual saves)
        DailyZmanim.objects.bulk_create(
            records_to_create,
            ignore_conflicts=True  # Skip if already exists
        )

        logger.info(f"Created {len(records_to_create)} zmanim records for {shul.name}")
        return len(records_to_create)

    @staticmethod
    def calculate_single_day(shul, target_date):
        """Calculate zmanim for a single day (for manual refresh)"""
        return ZmanimCalculator.calculate_date_range(shul, target_date, target_date)

    @staticmethod
    def calculate_six_months(shul, start_date=None):
        """Calculate 6 months of zmanim from start_date"""
        if start_date is None:
            start_date = date.today()

        end_date = start_date + timedelta(days=180)  # ~6 months
        return ZmanimCalculator.calculate_date_range(shul, start_date, end_date)
```

---

## Phase 3: Management Commands

### 3.1 Population Command

**File: `backend/zmanim_app/management/commands/populate_zmanim.py`** (new file)

```python
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
                self.stdout.write(self.style.SUCCESS(f"✓ Created {count} records for {shul.name}"))

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
                    self.stdout.write(self.style.SUCCESS(f"  ✓ Created {count} records"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  ✗ Error: {str(e)}"))

            self.stdout.write(self.style.SUCCESS(f"\n✓ Completed processing {total_shuls} shuls"))

        else:
            self.stdout.write(self.style.ERROR("Please specify --shul-id or --all-shuls"))
```

### 3.2 Extension Command

**File: `backend/zmanim_app/management/commands/extend_zmanim.py`** (new file)

```python
from django.core.management.base import BaseCommand
from datetime import date, timedelta
from zmanim_app.models import Shul, DailyZmanim
from zmanim_app.zmanim_calculator import ZmanimCalculator


class Command(BaseCommand):
    help = 'Extend zmanim calculations forward (run weekly to maintain 6-month buffer)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--months',
            type=int,
            default=1,
            help='Number of months to extend forward (default: 1)',
        )

    def handle(self, *args, **options):
        months = options.get('months')

        shuls = Shul.objects.filter(is_active=True)
        self.stdout.write(f"Extending zmanim by {months} month(s) for {shuls.count()} shuls...")

        for shul in shuls:
            # Find the last date we have data for
            last_record = DailyZmanim.objects.filter(shul=shul).order_by('-date').first()

            if last_record:
                start_date = last_record.date + timedelta(days=1)
            else:
                start_date = date.today()

            end_date = start_date + timedelta(days=months * 30)

            try:
                count = ZmanimCalculator.calculate_date_range(shul, start_date, end_date)
                self.stdout.write(self.style.SUCCESS(f"✓ {shul.name}: Added {count} days"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"✗ {shul.name}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS("\n✓ Extension complete"))
```

### 3.3 Cleanup Command

**File: `backend/zmanim_app/management/commands/cleanup_old_zmanim.py`** (new file)

```python
from django.core.management.base import BaseCommand
from datetime import date, timedelta
from zmanim_app.models import DailyZmanim


class Command(BaseCommand):
    help = 'Remove old zmanim data (keep last 30 days)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Keep data from last N days (default: 30)',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )

    def handle(self, *args, **options):
        days_to_keep = options.get('days')
        dry_run = options.get('dry_run')

        cutoff_date = date.today() - timedelta(days=days_to_keep)
        old_records = DailyZmanim.objects.filter(date__lt=cutoff_date)

        count = old_records.count()

        if dry_run:
            self.stdout.write(f"DRY RUN: Would delete {count} records older than {cutoff_date}")
        else:
            old_records.delete()
            self.stdout.write(self.style.SUCCESS(f"✓ Deleted {count} old records"))
```

---

## Phase 4: Update Views & APIs

### 4.1 Update Display API

**File: `backend/zmanim_app/views.py`** (modify existing view)

```python
@api_view(['GET'])
@permission_classes([AllowAny])
def shul_display_data(request, shul_slug):
    """Get all display data for a specific shul's display screen"""
    try:
        shul = Shul.objects.get(slug=shul_slug, is_active=True)
    except Shul.DoesNotExist:
        return Response({'error': 'Shul not found or inactive'}, status=status.HTTP_404_NOT_FOUND)

    today = date.today()

    # Get today's zmanim from DailyZmanim table
    daily_zmanim = DailyZmanim.objects.filter(shul=shul, date=today).first()

    if not daily_zmanim:
        return Response({'error': 'No zmanim data available for today'}, status=status.HTTP_404_NOT_FOUND)

    # Format zmanim data
    zmanim_data = {
        'Alos HaShachar': format_value(daily_zmanim.alos, shul.time_format, shul.show_seconds),
        'Neitz HaChamah': format_value(daily_zmanim.hanetz, shul.time_format, shul.show_seconds),
        'Chatzos': format_value(daily_zmanim.chatzos, shul.time_format, shul.show_seconds),
        'Mincha Gedola': format_value(daily_zmanim.mincha_gedola, shul.time_format, shul.show_seconds),
        'Mincha Ketana': format_value(daily_zmanim.mincha_ketana, shul.time_format, shul.show_seconds),
        'Plag HaMincha': format_value(daily_zmanim.plag_hamincha, shul.time_format, shul.show_seconds),
        'Shkiah': format_value(daily_zmanim.shkia, shul.time_format, shul.show_seconds),
        'Tzais': format_value(daily_zmanim.tzais, shul.time_format, shul.show_seconds),
        'Tzais 72 minutes': format_value(daily_zmanim.tzais_72, shul.time_format, shul.show_seconds),
        'Sof Zman Krias Shema GRA': format_value(daily_zmanim.sof_zman_krias_shema_gra, shul.time_format, shul.show_seconds),
        'Sof Zman Krias Shema MGA': format_value(daily_zmanim.sof_zman_krias_shema_mga, shul.time_format, shul.show_seconds),
        'Sof Zman Tefillah GRA': format_value(daily_zmanim.sof_zman_tfila_gra, shul.time_format, shul.show_seconds),
        'Sof Zman Tefillah MGA': format_value(daily_zmanim.sof_zman_tfila_mga, shul.time_format, shul.show_seconds),
        'Candle Lighting': format_value(daily_zmanim.candle_lighting, shul.time_format, shul.show_seconds),
    }

    # Add learning schedule
    limudim_data = {}
    if daily_zmanim.parsha:
        limudim_data['Parsha'] = daily_zmanim.parsha
    if daily_zmanim.daf_yomi_bavli:
        limudim_data['Daf Yomi Bavli'] = daily_zmanim.daf_yomi_bavli
    if daily_zmanim.mishna_yomis:
        limudim_data['Mishna Yomis'] = daily_zmanim.mishna_yomis
    if daily_zmanim.tehillim_monthly:
        limudim_data['Tehillim Monthly'] = daily_zmanim.tehillim_monthly
    if daily_zmanim.daf_yomi_yerushalmi:
        limudim_data['Daf Yomi Yerushalmi'] = daily_zmanim.daf_yomi_yerushalmi

    # Get custom times for today (keep existing logic)
    current_time = datetime.datetime.now()
    weekday = today.weekday()
    day_of_week = (weekday + 1) % 7

    from django.db import models
    custom_times = CustomTime.objects.filter(
        shul=shul
    ).filter(
        models.Q(daily=True) |
        models.Q(day_of_week=day_of_week)
    )

    custom_times_data = []
    for custom_time in custom_times:
        calculated_time = custom_time.calculate_time(today)
        if calculated_time:
            custom_times_data.append({
                'display_name': custom_time.display_name,
                'time': format_value(calculated_time.time(), shul.time_format, shul.show_seconds),
                'is_daily': custom_time.daily
            })

    return Response({
        'shul': {
            'name': shul.name,
            'language': shul.language,
            'time_format': shul.time_format,
            'show_seconds': shul.show_seconds,
            'timezone': shul.timezone
        },
        'zmanim': zmanim_data,
        'limudim': limudim_data,
        'custom_times': custom_times_data,
        'current_time': current_time.isoformat(),
        'last_updated': daily_zmanim.updated_at.isoformat() if daily_zmanim.updated_at else None
    })
```

### 4.2 Add Range Query API

**Add to `backend/zmanim_app/views.py`:**

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_zmanim_range(request):
    """Get zmanim for a date range"""
    shul = request.user.shuls.first()
    if not shul:
        return Response({'error': 'No shul found'}, status=status.HTTP_404_NOT_FOUND)

    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    if not start_date or not end_date:
        return Response({'error': 'start_date and end_date required'}, status=status.HTTP_400_BAD_REQUEST)

    zmanim_records = DailyZmanim.objects.filter(
        shul=shul,
        date__range=[start_date, end_date]
    ).order_by('date')

    from .serializers import DailyZmanimSerializer
    serializer = DailyZmanimSerializer(zmanim_records, many=True)

    return Response(serializer.data)
```

### 4.3 Create Serializer

**File: `backend/zmanim_app/serializers.py`** (add this)

```python
class DailyZmanimSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyZmanim
        fields = '__all__'
```

---

## Phase 5: Update Celery Tasks

### 5.1 Replace Daily Tasks

**File: `backend/zmanim_app/tasks.py`** (replace existing tasks)

```python
from celery import shared_task
from datetime import date, timedelta
import logging
from .models import Shul, DailyZmanim
from .zmanim_calculator import ZmanimCalculator

logger = logging.getLogger(__name__)


@shared_task
def extend_all_shuls_forward():
    """
    Weekly task to extend zmanim calculations forward by 1 month
    Maintains a rolling 6-month buffer
    """
    shuls = Shul.objects.filter(is_active=True)
    logger.info(f"Extending zmanim for {shuls.count()} active shuls")

    for shul in shuls:
        try:
            # Find last date we have data for
            last_record = DailyZmanim.objects.filter(shul=shul).order_by('-date').first()

            if last_record:
                start_date = last_record.date + timedelta(days=1)
            else:
                start_date = date.today()

            end_date = start_date + timedelta(days=30)  # Add 1 month

            count = ZmanimCalculator.calculate_date_range(shul, start_date, end_date)
            logger.info(f"Extended {shul.name}: added {count} days")

        except Exception as e:
            logger.error(f"Error extending {shul.name}: {str(e)}")

    return f"Extended {shuls.count()} shuls"


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
    """Monthly cleanup of old data (keep last 30 days)"""
    cutoff_date = date.today() - timedelta(days=30)
    deleted_count, _ = DailyZmanim.objects.filter(date__lt=cutoff_date).delete()

    logger.info(f"Cleaned up {deleted_count} old zmanim records")
    return f"Deleted {deleted_count} old records"


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
```

### 5.2 Update Celery Beat Schedule

**File: `backend/shul_display/celery.py`** (update schedule)

```python
from celery.schedules import crontab

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
        'schedule': crontab(hour=1, minute=0, day_of_month=1),  # First of month, 1 AM
    },
}
```

---

## Phase 6: Update Registration & Coordinate Changes

### 6.1 Auto-calculate on Registration

**File: `backend/zmanim_app/serializers.py`** (modify RegistrationSerializer)

```python
def create(self, validated_data):
    # ... existing user and shul creation code ...

    # Auto-calculate 6 months of zmanim for new shul
    from .zmanim_calculator import ZmanimCalculator
    from datetime import date, timedelta

    start_date = date.today()
    end_date = start_date + timedelta(days=180)
    ZmanimCalculator.calculate_date_range(shul, start_date, end_date)

    return {'user': user, 'shul': shul}
```

### 6.2 Recalculate on Coordinate Change

**File: `backend/zmanim_app/views.py`** (modify update_coordinates)

```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_coordinates(request):
    # ... existing coordinate update logic ...

    shul.save()

    # Trigger recalculation from today forward
    from .tasks import recalculate_shul_zmanim
    recalculate_shul_zmanim.delay(shul.id, from_date=date.today())

    return Response(ShulSerializer(shul).data)
```

---

## Phase 7: Testing & Validation

### 7.1 Test Checklist

- [ ] Create test shul
- [ ] Run `python manage.py populate_zmanim --shul-id=1 --months=6`
- [ ] Verify data in database
- [ ] Test display API returns correct data
- [ ] Test date range queries
- [ ] Test coordinate change triggers recalculation
- [ ] Test weekly extension task
- [ ] Test cleanup task

### 7.2 Migration Checklist

- [ ] Backup database
- [ ] Create `DailyZmanim` model and run migrations
- [ ] Populate data for all existing shuls
- [ ] Switch APIs to use `DailyZmanim`
- [ ] Monitor for 1-2 weeks
- [ ] Remove old zmanim fields from `Shul` model

---

## Implementation Timeline

### Week 1: Database & Calculator
- ✅ Create `DailyZmanim` model
- ✅ Run migrations
- ✅ Build `ZmanimCalculator` class
- ✅ Test calculations

### Week 2: Management Commands
- ✅ Create `populate_zmanim` command
- ✅ Create `extend_zmanim` command
- ✅ Create `cleanup_old_zmanim` command
- ✅ Populate test data

### Week 3: API Updates
- ✅ Update `shul_display_data` view
- ✅ Create range query endpoint
- ✅ Update `get_zmanim` view
- ✅ Test all endpoints

### Week 4: Celery & Production
- ✅ Update Celery tasks
- ✅ Update beat schedule
- ✅ Populate production data
- ✅ Switch to new system
- ✅ Monitor for issues

---

## Benefits Summary

### Immediate Benefits
- ✅ **Reliability**: No more daily calculation failures
- ✅ **Performance**: 100x faster (database query vs calculation)
- ✅ **Predictability**: See zmanim weeks/months ahead
- ✅ **Learning schedules**: Automatically included

### Long-term Benefits
- ✅ **Scalability**: Handles 100,000 shuls easily
- ✅ **Cost**: $1/month storage vs $50+/month workers
- ✅ **Maintenance**: Simpler debugging and monitoring
- ✅ **Features**: Foundation for calendar views, PDF exports, etc.

---

# 🔮 FUTURE ENHANCEMENTS (Not Needed Now)

## Advanced Schedule Override System

This is a **nice-to-have feature** for the future. Only implement after the core pre-calculation system is working perfectly.

### Use Case
Allow shuls to override zmanim for holidays, special events, or vacation schedules.

**Example**: "During Pesach 2025, Shacharit is at 8:00 AM instead of 15 minutes before sunrise"

### Implementation (When Ready)

#### New Tables

```sql
CREATE TABLE shul_schedules (
    id SERIAL PRIMARY KEY,
    shul_id INTEGER REFERENCES shul(id),
    name VARCHAR(200) NOT NULL, -- "Pesach 2025", "Summer Schedule"
    schedule_type VARCHAR(20) NOT NULL, -- holiday, event, recurring, vacation
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by_user_id INTEGER REFERENCES auth_user(id),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE schedule_overrides (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER REFERENCES shul_schedules(id),
    date DATE, -- specific date or NULL for all dates in range
    day_of_week INTEGER, -- 0-6 or NULL for all days
    prayer_name VARCHAR(50) NOT NULL, -- shacharit, mincha, maariv, etc.

    -- Time specification options
    custom_time TIME, -- fixed time like "7:30 AM"
    offset_type VARCHAR(20), -- fixed_time, minutes_before_sunset, etc.
    offset_base_zman VARCHAR(30), -- sunset, sunrise, shkia, etc.
    offset_minutes INTEGER, -- +/- minutes from base

    is_cancelled BOOLEAN DEFAULT FALSE -- no service this day
);
```

#### Override Resolver Logic

```python
class ScheduleResolver:
    """Apply schedule overrides to base zmanim"""

    def get_final_times_for_date(self, shul, date):
        # 1. Get base zmanim from DailyZmanim
        # 2. Check for active schedules
        # 3. Apply overrides with priority
        # 4. Return final times
        pass
```

### When to Implement This:
- ✅ Core pre-calculation system working
- ✅ All shuls using the system successfully
- ✅ Users requesting this feature
- ✅ You have 2-3 weeks of development time

**Until then**: Focus on getting the core system working perfectly!
