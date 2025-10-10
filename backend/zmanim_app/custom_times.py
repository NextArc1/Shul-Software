from datetime import datetime, timedelta
from zmanim.zmanim_calendar import ZmanimCalendar
from zmanim.util.geo_location import GeoLocation

class CustomTime:
    def __init__(self, internal_name, display_name, time_type, base_time=None, offset_minutes=0, fixed_time=None, day_of_week=None):
        self.internal_name = internal_name
        self.display_name = display_name
        self.time_type = time_type  # 'fixed' or 'dynamic'
        self.base_time = base_time
        self.offset_minutes = offset_minutes
        self.fixed_time = fixed_time
        self.day_of_week = day_of_week

    def calculate_time(self, latitude, longitude, timezone):
        if self.time_type == 'fixed':
            return self.fixed_time
        elif self.time_type == 'dynamic':
            location = GeoLocation('Custom Location', latitude, longitude, timezone)
            calendar = ZmanimCalendar(geo_location=location, date=datetime.now() + timedelta(days=(self.day_of_week - datetime.now().weekday()) % 7))
            base_time = getattr(calendar, self.base_time)()
            return base_time + timedelta(minutes=self.offset_minutes)

def get_custom_times(custom_times, latitude, longitude, timezone):
    calculated_times = {}
    for custom_time in custom_times:
        calculated_time = custom_time.calculate_time(latitude, longitude, timezone)
        calculated_times[custom_time.internal_name] = calculated_time
    return calculated_times