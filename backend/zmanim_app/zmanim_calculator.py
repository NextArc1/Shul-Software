from datetime import date, timedelta
from .models import Shul, DailyZmanim
from .get_daily_zmanim import get_daily_zmanim
from .custom_zmanim_calculations import get_custom_zmanim
from zmanim.util.geo_location import GeoLocation
from zmanim.zmanim_calendar import ZmanimCalendar
from zmanim.hebrew_calendar.jewish_calendar import JewishCalendar
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
            try:
                # Calculate basic zmanim for this date
                zmanim = get_daily_zmanim(
                    shul.latitude,
                    shul.longitude,
                    shul.timezone,
                    target_date=current_date,
                    name=shul.name
                )

                # Calculate learning schedule
                limudim = get_custom_zmanim(current_date, in_israel=False)

                # Create ZmanimCalendar and JewishCalendar for additional fields
                location = GeoLocation(shul.name, shul.latitude, shul.longitude, shul.timezone)
                zc = ZmanimCalendar(geo_location=location, date=current_date)
                jc = JewishCalendar()
                jc.set_gregorian_date(current_date.year, current_date.month, current_date.day)

                # Helper to convert datetime to time, handling None
                def to_time(dt):
                    return dt.time() if dt else None

                # Create DailyZmanim record with ALL fields
                daily_zmanim = DailyZmanim(
                    shul=shul,
                    date=current_date,

                    # Basic zmanim times (14 fields)
                    alos=to_time(zmanim.get('alos')),
                    hanetz=to_time(zmanim.get('hanetz')),
                    chatzos=to_time(zmanim.get('chatzos')),
                    mincha_gedola=to_time(zmanim.get('mincha_gedola')),
                    mincha_ketana=to_time(zmanim.get('mincha_ketana')),
                    plag_hamincha=to_time(zmanim.get('plag_hamincha')),
                    shkia=to_time(zmanim.get('shkia')),
                    tzais=to_time(zmanim.get('tzais')),
                    tzais_72=to_time(zmanim.get('tzais_72')),
                    sof_zman_krias_shema_gra=to_time(zmanim.get('sof_zman_krias_shema_gra')),
                    sof_zman_krias_shema_mga=to_time(zmanim.get('sof_zman_krias_shema_mga')),
                    sof_zman_tfila_gra=to_time(zmanim.get('sof_zman_tfila_gra')),
                    sof_zman_tfila_mga=to_time(zmanim.get('sof_zman_tfila_mga')),
                    candle_lighting=to_time(zmanim.get('candle_lighting')),

                    # Additional zmanim times (12 fields)
                    sea_level_sunrise=to_time(zc.sea_level_sunrise()),
                    sea_level_sunset=to_time(zc.sea_level_sunset()),
                    elevation_adjusted_sunrise=to_time(zc.elevation_adjusted_sunrise()),
                    elevation_adjusted_sunset=to_time(zc.elevation_adjusted_sunset()),
                    alos_16_1=to_time(zc.alos({'degrees': 16.1})),
                    alos_18=to_time(zc.alos({'degrees': 18})),
                    alos_19_8=to_time(zc.alos({'degrees': 19.8})),
                    tzais_8_5=to_time(zc.tzais({'degrees': 8.5})),
                    tzais_7_083=to_time(zc.tzais({'degrees': 7.083})),
                    tzais_5_95=to_time(zc.tzais({'degrees': 5.95})),
                    tzais_6_45=to_time(zc.tzais({'degrees': 6.45})),
                    sun_transit=to_time(zc.sun_transit()),

                    # Halachic hours (3 fields)
                    shaah_zmanis_gra=zc.shaah_zmanis_gra(),
                    shaah_zmanis_mga=zc.shaah_zmanis_mga(),
                    temporal_hour=zc.temporal_hour(),

                    # Jewish calendar - date info (5 fields)
                    jewish_year=jc.jewish_year,
                    jewish_month=jc.jewish_month,
                    jewish_month_name=jc.jewish_month_name(),
                    jewish_day=jc.jewish_day,
                    day_of_week=jc.day_of_week,

                    # Jewish calendar - special days (3 fields)
                    significant_day=jc.significant_day() or '',
                    day_of_omer=jc.day_of_omer(),
                    day_of_chanukah=jc.day_of_chanukah(),

                    # Jewish calendar - boolean flags (8 fields)
                    is_rosh_chodesh=jc.is_rosh_chodesh(),
                    is_yom_tov=jc.is_yom_tov(),
                    is_chol_hamoed=jc.is_chol_hamoed(),
                    is_erev_yom_tov=jc.is_erev_yom_tov(),
                    is_chanukah=jc.is_chanukah(),
                    is_taanis=jc.is_taanis(),
                    is_assur_bemelacha=jc.is_assur_bemelacha(),
                    is_erev_rosh_chodesh=jc.is_erev_rosh_chodesh(),

                    # Jewish calendar - molad (1 field)
                    molad_datetime=jc.molad_as_datetime(),

                    # Jewish calendar - kiddush levana (3 fields)
                    kiddush_levana_earliest_3_days=jc.techilas_zman_kiddush_levana_3_days(),
                    kiddush_levana_earliest_7_days=jc.techilas_zman_kiddush_levana_7_days(),
                    kiddush_levana_latest_15_days=jc.sof_zman_kiddush_levana_15_days(),

                    # Basic learning schedule (5 fields)
                    parsha=limudim.get('parsha', ''),
                    daf_yomi_bavli=limudim.get('dafyomibavli', ''),
                    mishna_yomis=limudim.get('mishnayomis', ''),
                    tehillim_monthly=limudim.get('tehillimmonthly', ''),
                    daf_yomi_yerushalmi=limudim.get('DafYomiYerushalmi', ''),

                    # Additional learning schedules (3 fields)
                    pirkei_avos=limudim.get('pirkeiavos', ''),
                    daf_hashavua_bavli=limudim.get('dafhashavuabavli', ''),
                    amud_yomi_bavli_dirshu=limudim.get('amudyomibavlidirshu', ''),
                )

                records_to_create.append(daily_zmanim)

            except Exception as e:
                logger.error(f"Error calculating zmanim for {current_date}: {str(e)}")

            current_date += timedelta(days=1)

        # Bulk insert (much faster than individual saves)
        if records_to_create:
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

    @staticmethod
    def recalculate_from_date(shul, from_date=None):
        """
        Recalculate zmanim from a specific date (e.g., after coordinate change)
        Deletes existing data from that date forward and recalculates
        """
        if from_date is None:
            from_date = date.today()

        logger.info(f"Recalculating zmanim for {shul.name} from {from_date}")

        # Delete existing records from this date forward
        deleted_count, _ = DailyZmanim.objects.filter(shul=shul, date__gte=from_date).delete()
        logger.info(f"Deleted {deleted_count} existing records")

        # Recalculate 6 months forward
        return ZmanimCalculator.calculate_six_months(shul, from_date)
