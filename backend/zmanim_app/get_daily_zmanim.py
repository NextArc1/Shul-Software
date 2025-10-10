import logging
from zmanim.util.geo_location import GeoLocation
from zmanim.zmanim_calendar import ZmanimCalendar
from zmanim.hebrew_calendar.jewish_calendar import JewishCalendar
from datetime import date

logger = logging.getLogger(__name__)


def get_daily_zmanim(latitude, longitude, timezone, target_date=None, name="Your Shul Name"):
    logger.info(f"Calculating zmanim for date: {target_date or 'today'}")
    try:
        location = GeoLocation(name, latitude, longitude, timezone)
        if target_date is None:
            target_date = date.today()
        zmanim_calendar = ZmanimCalendar(geo_location=location, date=target_date)
        jewish_calendar = JewishCalendar(date=target_date)

        zmanim = {
            'alos': zmanim_calendar.alos(),
            'hanetz': zmanim_calendar.sunrise(),
            'chatzos': zmanim_calendar.chatzos(),
            'mincha_gedola': zmanim_calendar.mincha_gedola(),
            'mincha_ketana': zmanim_calendar.mincha_ketana(),
            'plag_hamincha': zmanim_calendar.plag_hamincha(),
            'shkia': zmanim_calendar.sunset(),
            'tzais': zmanim_calendar.tzais(),
            'tzais_72': zmanim_calendar.tzais_72(),
            'sof_zman_krias_shema_gra': zmanim_calendar.sof_zman_shma_gra(),
            'sof_zman_krias_shema_mga': zmanim_calendar.sof_zman_shma_mga(),
            'sof_zman_tfila_gra': zmanim_calendar.sof_zman_tfila_gra(),
            'sof_zman_tfila_mga': zmanim_calendar.sof_zman_tfila_mga(),
            'candle_lighting': zmanim_calendar.candle_lighting(),
        }

        return zmanim
    except Exception as e:
        logger.exception(f"Error in get_daily_zmanim: {str(e)}")
        raise

