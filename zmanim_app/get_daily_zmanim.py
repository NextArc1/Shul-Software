from zmanim.util.geo_location import GeoLocation
from zmanim.zmanim_calendar import ZmanimCalendar
from .models import ShulSettings
from datetime import datetime


# Function to calculate daily zmanim and store them in ShulSettings
def get_daily_zmanim(latitude, longitude, name="Your Shul Name", time_zone="America/New_York"):
    # Initialize GeoLocation with the provided name and time zone
    location = GeoLocation(name=name, latitude=latitude, longitude=longitude, time_zone=time_zone)

    # Initialize ZmanimCalendar with today's date and the given location
    zmanim_calendar = ZmanimCalendar(geo_location=location)

    # Fetch all zmanim
    zmanim = {
        'alos': zmanim_calendar.alos(),
        'hanetz': zmanim_calendar.hanetz(),
        'chatzos': zmanim_calendar.chatzos(),
        'mincha_gedola': zmanim_calendar.mincha_gedola(),
        'mincha_ketana': zmanim_calendar.mincha_ketana(),
        'plag_hamincha': zmanim_calendar.plag_hamincha(),
        'shkia': zmanim_calendar.shkia(),
        'tzais': zmanim_calendar.tzais(),
        'tzais_72': zmanim_calendar.tzais_72(),
        'sof_zman_krias_shema_gra': zmanim_calendar.sof_zman_shma_gra(),
        'sof_zman_krias_shema_mga': zmanim_calendar.sof_zman_shma_mga(),
        'sof_zman_tfila_gra': zmanim_calendar.sof_zman_tfila_gra(),
        'sof_zman_tfila_mga': zmanim_calendar.sof_zman_tfila_mga(),
        'candle_lighting': zmanim_calendar.candle_lighting(),
    }

    # Update the ShulSettings record
    shul_settings = ShulSettings.objects.first()
    if shul_settings:
        shul_settings.alos = zmanim['alos']
        shul_settings.hanetz = zmanim['hanetz']
        shul_settings.chatzos = zmanim['chatzos']
        shul_settings.mincha_gedola = zmanim['mincha_gedola']
        shul_settings.mincha_ketana = zmanim['mincha_ketana']
        shul_settings.plag_hamincha = zmanim['plag_hamincha']
        shul_settings.shkia = zmanim['shkia']
        shul_settings.tzais = zmanim['tzais']
        shul_settings.tzais_72 = zmanim['tzais_72']
        shul_settings.sof_zman_krias_shema_gra = zmanim['sof_zman_krias_shema_gra']
        shul_settings.sof_zman_krias_shema_mga = zmanim['sof_zman_krias_shema_mga']
        shul_settings.sof_zman_tfila_gra = zmanim['sof_zman_tfila_gra']
        shul_settings.sof_zman_tfila_mga = zmanim['sof_zman_tfila_mga']
        shul_settings.candle_lighting = zmanim['candle_lighting']


        # Save the updated settings
        shul_settings.save()
    else:
        print("No ShulSettings record found.")
