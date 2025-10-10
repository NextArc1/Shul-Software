import requests
import logging
from django.contrib.auth import authenticate
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from decouple import config

from .models import Shul, CustomTime, DailyZmanim
from .serializers import (
    UserSerializer, ShulSerializer, CustomTimeSerializer,
    RegistrationSerializer
)
from .get_daily_zmanim import get_daily_zmanim
from .translations import (
    translate_dict_keys,
    translate_term,
    translate_daf_yomi,
    translate_parsha,
    translate_mishna_yomis,
    translate_tehillim,
    translate_amud_yomi,
    number_to_gematria,
    JEWISH_MONTH_NAMES
)
from datetime import date, timedelta
import datetime

logger = logging.getLogger(__name__)


def fetch_timezone_by_coordinates(latitude, longitude):
    """Fetch timezone by coordinates"""
    api_url = f"https://timeapi.io/api/TimeZone/coordinate?latitude={latitude}&longitude={longitude}"
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        if 'timeZone' in data:
            return data['timeZone']
    return None


class RegisterView(APIView):
    """Register a new shul and admin user"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.save()
            user = result['user']
            shul = result['shul']
            
            # Create auth token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'shul': ShulSerializer(shul).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """Login with email and password"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate using email
        user = authenticate(username=email, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            shul = user.shuls.first()  # Get user's shul
            
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'shul': ShulSerializer(shul).data if shul else None
            })
        
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """Logout and delete token"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass
        return Response({'message': 'Logged out successfully'})


class ShulDetailView(generics.RetrieveUpdateAPIView):
    """Get or update shul details"""
    serializer_class = ShulSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the shul owned by the current user
        return self.request.user.shuls.first()

    def update(self, request, *args, **kwargs):
        # Handle logo removal if requested
        if request.data.get('remove_logo') == 'true':
            shul = self.get_object()
            if shul.center_logo:
                shul.center_logo.delete(save=True)

        return super().update(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_coordinates(request):
    """Update shul coordinates and location settings"""
    shul = request.user.shuls.first()
    if not shul:
        return Response({'error': 'No shul found'}, status=status.HTTP_404_NOT_FOUND)
    
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')
    zip_code = request.data.get('zip_code')
    country = request.data.get('country')
    
    # Get coordinates from zip code if not provided
    if not (latitude and longitude) and zip_code:
        api_key = config('OPENCAGE_API_KEY')
        query = f"{zip_code}, {country}"
        api_url = f"https://api.opencagedata.com/geocode/v1/json?q={query}&key={api_key}&limit=1"
        
        response = requests.get(api_url)
        data = response.json()
        
        if data and data['results']:
            coordinates = data['results'][0]['geometry']
            latitude = coordinates['lat']
            longitude = coordinates['lng']
        else:
            return Response({'error': 'Coordinates not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Ensure coordinates are floats
    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid coordinates'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get timezone
    timezone = fetch_timezone_by_coordinates(latitude, longitude)
    
    # Update shul
    shul.latitude = latitude
    shul.longitude = longitude
    shul.timezone = timezone
    shul.country = country
    if zip_code:
        shul.zip_code = zip_code
    
    # Update display settings if provided
    if 'language' in request.data:
        shul.language = request.data['language']
    if 'time_format' in request.data:
        shul.time_format = request.data['time_format']
    if 'show_seconds' in request.data:
        shul.show_seconds = request.data['show_seconds']
    
    shul.save()

    # Trigger recalculation from today forward (coordinates changed)
    from .tasks import recalculate_shul_zmanim
    recalculate_shul_zmanim.delay(shul.id, from_date=date.today())

    return Response(ShulSerializer(shul).data)


def get_rounding_direction(field_name):
    """Determine rounding direction for a field based on halachic stringency"""
    field_lower = field_name.lower()

    # Round DOWN (truncate) - Latest times (deadlines)
    round_down_fields = [
        'sof zman', 'candle lighting', 'kiddush levana latest'
    ]
    if any(field in field_lower for field in round_down_fields):
        return 'down'

    # Round UP (ceiling) - Earliest times
    round_up_fields = [
        'alos', 'netz', 'neitz', 'sunrise', 'mincha gedola', 'mincha ketana',
        'plag', 'tzais', 'tzeis', 'tzeit', 'kiddush levana earliest'
    ]
    if any(field in field_lower for field in round_up_fields):
        return 'up'

    # Round to NEAREST - Neutral times
    round_nearest_fields = ['shkia', 'shkiah', 'sunset', 'chatzos', 'chatzot', 'sun transit']
    if any(field in field_lower for field in round_nearest_fields):
        return 'nearest'

    # Default to rounding up for safety (le'chumra)
    return 'up'


def round_time_for_display(time_obj, field_name=''):
    """Round a time object based on field type for halachic stringency"""
    from datetime import time as dt_time

    if not isinstance(time_obj, (dt_time, datetime.datetime)):
        return time_obj

    # Extract time if it's a datetime object
    if isinstance(time_obj, datetime.datetime):
        time_part = time_obj.time()
        is_datetime = True
    else:
        time_part = time_obj
        is_datetime = False

    seconds = time_part.second
    if seconds == 0:
        return time_obj  # No rounding needed

    direction = get_rounding_direction(field_name)

    # Convert time to datetime for easier manipulation
    dt = datetime.datetime.combine(datetime.datetime.today(), time_part)

    if direction == 'down':
        # Round down - just remove seconds
        dt = dt.replace(second=0, microsecond=0)
    elif direction == 'up':
        # Round up - add 1 minute if there are any seconds
        dt = dt.replace(second=0, microsecond=0) + timedelta(minutes=1)
    else:  # nearest
        # Round to nearest minute
        if seconds >= 30:
            dt = dt.replace(second=0, microsecond=0) + timedelta(minutes=1)
        else:
            dt = dt.replace(second=0, microsecond=0)

    # Return in same format as input
    if is_datetime:
        return datetime.datetime.combine(time_obj.date(), dt.time())
    else:
        return dt.time()


def format_value(value, time_format="24h", show_seconds=True, field_name=''):
    """Format time values for display with intelligent rounding"""
    if hasattr(value, 'strftime'):
        # Apply intelligent rounding if not showing seconds
        if not show_seconds and hasattr(value, 'replace'):
            value = round_time_for_display(value, field_name)

        if time_format == "12h":
            formatted_time = value.strftime('%I:%M:%S' if show_seconds else '%I:%M').lstrip('0')
            return formatted_time
        return value.strftime('%H:%M:%S') if show_seconds else value.strftime('%H:%M')
    return str(value) if value is not None else None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_zmanim(request):
    """Get current zmanim for the user's shul"""
    shul = request.user.shuls.first()
    if not shul:
        return Response({'error': 'No shul found'}, status=status.HTTP_404_NOT_FOUND)

    # Get today's date in the shul's timezone
    import pytz
    tz = pytz.timezone(shul.timezone)
    today = datetime.datetime.now(tz).date()

    # Get today's zmanim from DailyZmanim table
    daily_zmanim = DailyZmanim.objects.filter(shul=shul, date=today).first()

    if not daily_zmanim:
        return Response({'error': 'No zmanim data available for today. Please contact support.'},
                       status=status.HTTP_404_NOT_FOUND)

    # Format zmanim data - BASIC ZMANIM (14 fields)
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
        # ADDITIONAL ZMANIM (12 time fields)
        'Sea Level Sunrise': format_value(daily_zmanim.sea_level_sunrise, shul.time_format, shul.show_seconds),
        'Sea Level Sunset': format_value(daily_zmanim.sea_level_sunset, shul.time_format, shul.show_seconds),
        'Elevation Adjusted Sunrise': format_value(daily_zmanim.elevation_adjusted_sunrise, shul.time_format, shul.show_seconds),
        'Elevation Adjusted Sunset': format_value(daily_zmanim.elevation_adjusted_sunset, shul.time_format, shul.show_seconds),
        'Alos 16.1°': format_value(daily_zmanim.alos_16_1, shul.time_format, shul.show_seconds),
        'Alos 18°': format_value(daily_zmanim.alos_18, shul.time_format, shul.show_seconds),
        'Alos 19.8°': format_value(daily_zmanim.alos_19_8, shul.time_format, shul.show_seconds),
        'Tzais 8.5°': format_value(daily_zmanim.tzais_8_5, shul.time_format, shul.show_seconds),
        'Tzais 7.083°': format_value(daily_zmanim.tzais_7_083, shul.time_format, shul.show_seconds),
        'Tzais 5.95°': format_value(daily_zmanim.tzais_5_95, shul.time_format, shul.show_seconds),
        'Tzais 6.45°': format_value(daily_zmanim.tzais_6_45, shul.time_format, shul.show_seconds),
        'Sun Transit': format_value(daily_zmanim.sun_transit, shul.time_format, shul.show_seconds),
        # HALACHIC HOURS (3 fields) - formatted as minutes
        'Shaah Zmanis GRA': f"{(daily_zmanim.shaah_zmanis_gra / 60000):.1f} min" if daily_zmanim.shaah_zmanis_gra else None,
        'Shaah Zmanis MGA': f"{(daily_zmanim.shaah_zmanis_mga / 60000):.1f} min" if daily_zmanim.shaah_zmanis_mga else None,
        'Temporal Hour': f"{(daily_zmanim.temporal_hour / 60000):.1f} min" if daily_zmanim.temporal_hour else None,
    }

    # Add learning schedule if available - LIMUDIM (8 fields)
    limudim_data = {}
    if daily_zmanim.parsha:
        limudim_data['Parsha'] = daily_zmanim.parsha
    if daily_zmanim.daf_yomi_bavli:
        limudim_data['Daf Yomi Bavli'] = daily_zmanim.daf_yomi_bavli
    if daily_zmanim.daf_yomi_yerushalmi:
        limudim_data['Daf Yomi Yerushalmi'] = daily_zmanim.daf_yomi_yerushalmi
    if daily_zmanim.mishna_yomis:
        limudim_data['Mishna Yomis'] = daily_zmanim.mishna_yomis
    if daily_zmanim.tehillim_monthly:
        limudim_data['Tehillim Monthly'] = daily_zmanim.tehillim_monthly
    if daily_zmanim.pirkei_avos:
        limudim_data['Pirkei Avos'] = daily_zmanim.pirkei_avos
    if daily_zmanim.daf_hashavua_bavli:
        limudim_data['Daf HaShavua Bavli'] = daily_zmanim.daf_hashavua_bavli
    if daily_zmanim.amud_yomi_bavli_dirshu:
        limudim_data['Amud Yomi Bavli Dirshu'] = daily_zmanim.amud_yomi_bavli_dirshu

    # Apply translations based on shul language setting
    language = shul.language if shul.language else 'en'

    # JEWISH CALENDAR DATA (20 fields)
    # Translate month name
    translated_month_name = daily_zmanim.jewish_month_name
    if daily_zmanim.jewish_month_name:
        month_name_lower = daily_zmanim.jewish_month_name.lower().replace(' ', '_')
        translated_month_name = JEWISH_MONTH_NAMES.get(month_name_lower, {}).get(language, daily_zmanim.jewish_month_name)

    jewish_calendar_data = {
        'Jewish Year': daily_zmanim.jewish_year,
        'Jewish Month': daily_zmanim.jewish_month,
        'Jewish Month Name': translated_month_name,
        'Jewish Day': daily_zmanim.jewish_day,
        'Day of Week': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][daily_zmanim.day_of_week] if daily_zmanim.day_of_week is not None else None,
        'Significant Day': daily_zmanim.significant_day if daily_zmanim.significant_day else None,
        'Day of Omer': daily_zmanim.day_of_omer,
        'Day of Chanukah': daily_zmanim.day_of_chanukah,
        'Is Rosh Chodesh': daily_zmanim.is_rosh_chodesh,
        'Is Yom Tov': daily_zmanim.is_yom_tov,
        'Is Chol HaMoed': daily_zmanim.is_chol_hamoed,
        'Is Erev Yom Tov': daily_zmanim.is_erev_yom_tov,
        'Is Chanukah': daily_zmanim.is_chanukah,
        'Is Fast Day': daily_zmanim.is_taanis,
        'Is Assur Bemelacha': daily_zmanim.is_assur_bemelacha,
        'Is Erev Rosh Chodesh': daily_zmanim.is_erev_rosh_chodesh,
        'Molad': format_value(daily_zmanim.molad_datetime, shul.time_format, shul.show_seconds, 'Molad') if daily_zmanim.molad_datetime else None,
        'Kiddush Levana Earliest (3 Days)': format_value(daily_zmanim.kiddush_levana_earliest_3_days, shul.time_format, shul.show_seconds, 'Kiddush Levana Earliest (3 Days)') if daily_zmanim.kiddush_levana_earliest_3_days else None,
        'Kiddush Levana Earliest (7 Days)': format_value(daily_zmanim.kiddush_levana_earliest_7_days, shul.time_format, shul.show_seconds, 'Kiddush Levana Earliest (7 Days)') if daily_zmanim.kiddush_levana_earliest_7_days else None,
        'Kiddush Levana Latest (15 Days)': format_value(daily_zmanim.kiddush_levana_latest_15_days, shul.time_format, shul.show_seconds, 'Kiddush Levana Latest (15 Days)') if daily_zmanim.kiddush_levana_latest_15_days else None,
    }

    # Create formatted Hebrew date
    formatted_hebrew_date = None
    if daily_zmanim.jewish_day and daily_zmanim.jewish_month_name and daily_zmanim.jewish_year:
        # Translate month name based on language
        month_name_lower = daily_zmanim.jewish_month_name.lower().replace(' ', '_')
        translated_month = JEWISH_MONTH_NAMES.get(month_name_lower, {}).get(language, daily_zmanim.jewish_month_name)

        if language in ['he', 'sh', 'ah']:
            # Hebrew format with gematria numerals
            day_hebrew = number_to_gematria(daily_zmanim.jewish_day)
            # For Jewish years, only use last 3 digits (e.g., 5786 -> 786)
            year_short = daily_zmanim.jewish_year % 1000
            year_hebrew = number_to_gematria(year_short)
            formatted_hebrew_date = f"{day_hebrew} {translated_month} {year_hebrew}"
        else:
            # Ashkenazi/Sephardic format with regular numbers
            formatted_hebrew_date = f"{daily_zmanim.jewish_day} {translated_month} {daily_zmanim.jewish_year}"

    # Create display name translations (keep original keys for lookup)
    zmanim_display_names = {key: translate_term(key, language) for key in zmanim_data.keys()}
    limudim_display_names = {key: translate_term(key, language) for key in limudim_data.keys()}
    calendar_display_names = {key: translate_term(key, language) for key in jewish_calendar_data.keys()}

    # Translate tractate names in Daf Yomi values
    translated_limudim = {}
    for key, value in limudim_data.items():
        if key in ['Daf Yomi Bavli', 'Daf Yomi Yerushalmi', 'Daf HaShavua Bavli'] and value:
            translated_limudim[key] = translate_daf_yomi(value, language)
        elif key == 'Amud Yomi Bavli Dirshu' and value:
            translated_limudim[key] = translate_amud_yomi(value, language)
        elif key == 'Mishna Yomis' and value:
            translated_limudim[key] = translate_mishna_yomis(value, language)
        elif key == 'Tehillim Monthly' and value:
            translated_limudim[key] = translate_tehillim(value, language)
        elif key == 'Parsha' and value:
            translated_limudim[key] = translate_parsha(value, language)
        else:
            translated_limudim[key] = value

    return Response({
        'zmanim': zmanim_data,
        'limudim': translated_limudim,
        'jewish_calendar': jewish_calendar_data,
        'zmanim_display_names': zmanim_display_names,
        'limudim_display_names': limudim_display_names,
        'calendar_display_names': calendar_display_names,
        'formatted_hebrew_date': formatted_hebrew_date,
        'last_updated': daily_zmanim.updated_at
    })


class CustomTimeListCreateView(generics.ListCreateAPIView):
    """List and create custom times"""
    serializer_class = CustomTimeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomTime.objects.filter(shul__admin=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['shul'] = self.request.user.shuls.first()
        return context

    def perform_create(self, serializer):
        shul = self.request.user.shuls.first()
        serializer.save(shul=shul)

    def list(self, request, *args, **kwargs):
        """Override list to include calculated times for today"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Add calculated times for today
        today = date.today()
        data = []
        for item, custom_time_obj in zip(serializer.data, queryset):
            item_dict = dict(item)
            calculated_time = custom_time_obj.calculate_time(today)
            if calculated_time:
                item_dict['calculated_time'] = calculated_time.isoformat()
            else:
                item_dict['calculated_time'] = None
            data.append(item_dict)

        return Response(data)


class CustomTimeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a custom time"""
    serializer_class = CustomTimeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomTime.objects.filter(shul__admin=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['shul'] = self.request.user.shuls.first()
        return context


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_zmanim(request):
    """Manually refresh zmanim for the user's shul (recalculates 6 months)"""
    shul = request.user.shuls.first()
    if not shul:
        return Response({'error': 'No shul found'}, status=status.HTTP_404_NOT_FOUND)

    from .zmanim_calculator import ZmanimCalculator

    # Calculate 6 months of zmanim
    today = date.today()
    end_date = today + timedelta(days=180)  # 6 months

    # Delete all past records (before today)
    DailyZmanim.objects.filter(shul=shul, date__lt=today).delete()

    # Delete existing records in the 6-month range
    DailyZmanim.objects.filter(shul=shul, date__range=[today, end_date]).delete()

    # Recalculate
    count = ZmanimCalculator.calculate_date_range(shul, today, end_date)

    return Response({
        'message': f'Recalculated zmanim for 6 months',
        'start_date': today.isoformat(),
        'end_date': end_date.isoformat(),
        'records_created': count
    })


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_base_times(request):
    """Get all available fields from DailyZmanim that can be used for dynamic custom times or display"""

    available_fields = {
        # ========== BASIC ZMANIM TIMES (14 fields) ==========
        'alos': 'Alos HaShachar',
        'hanetz': 'Neitz HaChamah (Sunrise)',
        'chatzos': 'Chatzos (Midday)',
        'mincha_gedola': 'Mincha Gedola',
        'mincha_ketana': 'Mincha Ketana',
        'plag_hamincha': 'Plag HaMincha',
        'shkia': 'Shkiah (Sunset)',
        'tzais': 'Tzais (Nightfall)',
        'tzais_72': 'Tzais 72 Minutes',
        'sof_zman_krias_shema_gra': 'Sof Zman Krias Shema (GRA)',
        'sof_zman_krias_shema_mga': 'Sof Zman Krias Shema (MGA)',
        'sof_zman_tfila_gra': 'Sof Zman Tefillah (GRA)',
        'sof_zman_tfila_mga': 'Sof Zman Tefillah (MGA)',
        'candle_lighting': 'Candle Lighting',

        # ========== ADDITIONAL ZMANIM TIMES (12 fields) ==========
        'sea_level_sunrise': 'Sea Level Sunrise',
        'sea_level_sunset': 'Sea Level Sunset',
        'elevation_adjusted_sunrise': 'Elevation Adjusted Sunrise',
        'elevation_adjusted_sunset': 'Elevation Adjusted Sunset',
        'alos_16_1': 'Alos 16.1°',
        'alos_18': 'Alos 18°',
        'alos_19_8': 'Alos 19.8°',
        'tzais_8_5': 'Tzais 8.5°',
        'tzais_7_083': 'Tzais 7.083°',
        'tzais_5_95': 'Tzais 5.95°',
        'tzais_6_45': 'Tzais 6.45°',
        'sun_transit': 'Sun Transit (Chatzos HaChamah)',

        # ========== HALACHIC HOURS (3 fields) ==========
        'shaah_zmanis_gra': 'Shaah Zmanis (GRA) - in minutes',
        'shaah_zmanis_mga': 'Shaah Zmanis (MGA) - in minutes',
        'temporal_hour': 'Temporal Hour - in minutes',

        # ========== JEWISH CALENDAR - DATE INFO (5 fields) ==========
        'jewish_year': 'Jewish Year',
        'jewish_month': 'Jewish Month (Number)',
        'jewish_month_name': 'Jewish Month Name',
        'jewish_day': 'Jewish Day',
        'day_of_week': 'Day of Week (1=Sunday, 7=Saturday)',

        # ========== JEWISH CALENDAR - SPECIAL DAYS (3 fields) ==========
        'significant_day': 'Significant Day (Holiday Name)',
        'day_of_omer': 'Day of Omer',
        'day_of_chanukah': 'Day of Chanukah',

        # ========== JEWISH CALENDAR - BOOLEAN FLAGS (8 fields) ==========
        'is_rosh_chodesh': 'Is Rosh Chodesh',
        'is_yom_tov': 'Is Yom Tov',
        'is_chol_hamoed': 'Is Chol HaMoed',
        'is_erev_yom_tov': 'Is Erev Yom Tov',
        'is_chanukah': 'Is Chanukah',
        'is_taanis': 'Is Fast Day',
        'is_assur_bemelacha': 'Is Assur Bemelacha',
        'is_erev_rosh_chodesh': 'Is Erev Rosh Chodesh',

        # ========== JEWISH CALENDAR - MOLAD (1 field) ==========
        'molad_datetime': 'Molad (Date & Time)',

        # ========== JEWISH CALENDAR - KIDDUSH LEVANA (3 fields) ==========
        'kiddush_levana_earliest_3_days': 'Kiddush Levana Earliest (3 Days)',
        'kiddush_levana_earliest_7_days': 'Kiddush Levana Earliest (7 Days)',
        'kiddush_levana_latest_15_days': 'Kiddush Levana Latest (15 Days)',

        # ========== BASIC LEARNING SCHEDULE (5 fields) ==========
        'parsha': 'Parsha',
        'daf_yomi_bavli': 'Daf Yomi Bavli',
        'mishna_yomis': 'Mishna Yomis',
        'tehillim_monthly': 'Tehillim Monthly',
        'daf_yomi_yerushalmi': 'Daf Yomi Yerushalmi',

        # ========== ADDITIONAL LEARNING SCHEDULES (3 fields) ==========
        'pirkei_avos': 'Pirkei Avos',
        'daf_hashavua_bavli': 'Daf HaShavua Bavli',
        'amud_yomi_bavli_dirshu': 'Amud Yomi Bavli Dirshu',
    }

    return Response(available_fields)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def display_layout(request):
    """Get or update the display layout configuration for the user's shul"""
    shul = request.user.shuls.first()
    if not shul:
        return Response({'error': 'No shul found'}, status=status.HTTP_404_NOT_FOUND)

    from .models import ShulDisplayLayout
    from .serializers import ShulDisplayLayoutSerializer

    # Get or create layout for this shul
    layout, created = ShulDisplayLayout.objects.get_or_create(shul=shul)

    if request.method == 'GET':
        serializer = ShulDisplayLayoutSerializer(layout)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update layout configuration
        layout.layout_config = request.data.get('layout_config', {})
        layout.save()

        serializer = ShulDisplayLayoutSerializer(layout)
        return Response(serializer.data)


# PUBLIC SHUL DISPLAY API (No Authentication - for display screens)

@api_view(['GET'])
@permission_classes([AllowAny])
def shul_display_data(request, shul_slug):
    """Get all display data for a specific shul's display screen"""
    try:
        shul = Shul.objects.get(slug=shul_slug, is_active=True)
    except Shul.DoesNotExist:
        return Response({'error': 'Shul not found or inactive'}, status=status.HTTP_404_NOT_FOUND)

    # Get current time in the shul's timezone
    import pytz
    tz = pytz.timezone(shul.timezone)
    current_time = datetime.datetime.now(tz)
    today = current_time.date()  # Use shul's local date, not server's date

    # Get today's zmanim from DailyZmanim table
    daily_zmanim = DailyZmanim.objects.filter(shul=shul, date=today).first()

    if not daily_zmanim:
        return Response({'error': 'No zmanim data available for today'}, status=status.HTTP_404_NOT_FOUND)

    # Format zmanim data - BASIC ZMANIM
    zmanim_data = {
        'Alos HaShachar': format_value(daily_zmanim.alos, shul.time_format, shul.show_seconds, 'Alos HaShachar'),
        'Neitz HaChamah': format_value(daily_zmanim.hanetz, shul.time_format, shul.show_seconds, 'Neitz HaChamah'),
        'Chatzos': format_value(daily_zmanim.chatzos, shul.time_format, shul.show_seconds, 'Chatzos'),
        'Mincha Gedola': format_value(daily_zmanim.mincha_gedola, shul.time_format, shul.show_seconds, 'Mincha Gedola'),
        'Mincha Ketana': format_value(daily_zmanim.mincha_ketana, shul.time_format, shul.show_seconds, 'Mincha Ketana'),
        'Plag HaMincha': format_value(daily_zmanim.plag_hamincha, shul.time_format, shul.show_seconds, 'Plag HaMincha'),
        'Shkiah': format_value(daily_zmanim.shkia, shul.time_format, shul.show_seconds, 'Shkiah'),
        'Tzais': format_value(daily_zmanim.tzais, shul.time_format, shul.show_seconds, 'Tzais'),
        'Tzais 72 minutes': format_value(daily_zmanim.tzais_72, shul.time_format, shul.show_seconds, 'Tzais 72 minutes'),
        'Sof Zman Krias Shema GRA': format_value(daily_zmanim.sof_zman_krias_shema_gra, shul.time_format, shul.show_seconds, 'Sof Zman Krias Shema GRA'),
        'Sof Zman Krias Shema MGA': format_value(daily_zmanim.sof_zman_krias_shema_mga, shul.time_format, shul.show_seconds, 'Sof Zman Krias Shema MGA'),
        'Sof Zman Tefillah GRA': format_value(daily_zmanim.sof_zman_tfila_gra, shul.time_format, shul.show_seconds, 'Sof Zman Tefillah GRA'),
        'Sof Zman Tefillah MGA': format_value(daily_zmanim.sof_zman_tfila_mga, shul.time_format, shul.show_seconds, 'Sof Zman Tefillah MGA'),
        'Candle Lighting': format_value(daily_zmanim.candle_lighting, shul.time_format, shul.show_seconds, 'Candle Lighting'),
        # ADDITIONAL ZMANIM
        'Sea Level Sunrise': format_value(daily_zmanim.sea_level_sunrise, shul.time_format, shul.show_seconds, 'Sea Level Sunrise'),
        'Sea Level Sunset': format_value(daily_zmanim.sea_level_sunset, shul.time_format, shul.show_seconds, 'Sea Level Sunset'),
        'Elevation Adjusted Sunrise': format_value(daily_zmanim.elevation_adjusted_sunrise, shul.time_format, shul.show_seconds, 'Elevation Adjusted Sunrise'),
        'Elevation Adjusted Sunset': format_value(daily_zmanim.elevation_adjusted_sunset, shul.time_format, shul.show_seconds, 'Elevation Adjusted Sunset'),
        'Alos 16.1°': format_value(daily_zmanim.alos_16_1, shul.time_format, shul.show_seconds, 'Alos 16.1°'),
        'Alos 18°': format_value(daily_zmanim.alos_18, shul.time_format, shul.show_seconds, 'Alos 18°'),
        'Alos 19.8°': format_value(daily_zmanim.alos_19_8, shul.time_format, shul.show_seconds, 'Alos 19.8°'),
        'Tzais 8.5°': format_value(daily_zmanim.tzais_8_5, shul.time_format, shul.show_seconds, 'Tzais 8.5°'),
        'Tzais 7.083°': format_value(daily_zmanim.tzais_7_083, shul.time_format, shul.show_seconds, 'Tzais 7.083°'),
        'Tzais 5.95°': format_value(daily_zmanim.tzais_5_95, shul.time_format, shul.show_seconds, 'Tzais 5.95°'),
        'Tzais 6.45°': format_value(daily_zmanim.tzais_6_45, shul.time_format, shul.show_seconds, 'Tzais 6.45°'),
        'Sun Transit': format_value(daily_zmanim.sun_transit, shul.time_format, shul.show_seconds, 'Sun Transit'),
        # HALACHIC HOURS
        'Shaah Zmanis GRA': f"{(daily_zmanim.shaah_zmanis_gra / 60000):.1f} min" if daily_zmanim.shaah_zmanis_gra else None,
        'Shaah Zmanis MGA': f"{(daily_zmanim.shaah_zmanis_mga / 60000):.1f} min" if daily_zmanim.shaah_zmanis_mga else None,
        'Temporal Hour': f"{(daily_zmanim.temporal_hour / 60000):.1f} min" if daily_zmanim.temporal_hour else None,
    }

    # Add learning schedule - ALL LIMUDIM (8 fields)
    limudim_data = {}
    if daily_zmanim.parsha:
        limudim_data['Parsha'] = daily_zmanim.parsha
    if daily_zmanim.daf_yomi_bavli:
        limudim_data['Daf Yomi Bavli'] = daily_zmanim.daf_yomi_bavli
    if daily_zmanim.daf_yomi_yerushalmi:
        limudim_data['Daf Yomi Yerushalmi'] = daily_zmanim.daf_yomi_yerushalmi
    if daily_zmanim.mishna_yomis:
        limudim_data['Mishna Yomis'] = daily_zmanim.mishna_yomis
    if daily_zmanim.tehillim_monthly:
        limudim_data['Tehillim Monthly'] = daily_zmanim.tehillim_monthly
    if daily_zmanim.pirkei_avos:
        limudim_data['Pirkei Avos'] = daily_zmanim.pirkei_avos
    if daily_zmanim.daf_hashavua_bavli:
        limudim_data['Daf HaShavua Bavli'] = daily_zmanim.daf_hashavua_bavli
    if daily_zmanim.amud_yomi_bavli_dirshu:
        limudim_data['Amud Yomi Bavli Dirshu'] = daily_zmanim.amud_yomi_bavli_dirshu

    # Apply translations based on shul language setting
    language = shul.language if shul.language else 'en'

    # JEWISH CALENDAR DATA
    # Translate month name
    translated_month_name = daily_zmanim.jewish_month_name
    if daily_zmanim.jewish_month_name:
        month_name_lower = daily_zmanim.jewish_month_name.lower().replace(' ', '_')
        translated_month_name = JEWISH_MONTH_NAMES.get(month_name_lower, {}).get(language, daily_zmanim.jewish_month_name)

    jewish_calendar_data = {
        'Jewish Year': daily_zmanim.jewish_year,
        'Jewish Month': daily_zmanim.jewish_month,
        'Jewish Month Name': translated_month_name,
        'Jewish Day': daily_zmanim.jewish_day,
        'Day of Week': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][daily_zmanim.day_of_week] if daily_zmanim.day_of_week is not None else None,
        'Significant Day': daily_zmanim.significant_day if daily_zmanim.significant_day else None,
        'Day of Omer': daily_zmanim.day_of_omer,
        'Day of Chanukah': daily_zmanim.day_of_chanukah,
        'Is Rosh Chodesh': daily_zmanim.is_rosh_chodesh,
        'Is Yom Tov': daily_zmanim.is_yom_tov,
        'Is Chol HaMoed': daily_zmanim.is_chol_hamoed,
        'Is Erev Yom Tov': daily_zmanim.is_erev_yom_tov,
        'Is Chanukah': daily_zmanim.is_chanukah,
        'Is Fast Day': daily_zmanim.is_taanis,
        'Is Assur Bemelacha': daily_zmanim.is_assur_bemelacha,
        'Is Erev Rosh Chodesh': daily_zmanim.is_erev_rosh_chodesh,
        'Molad': format_value(daily_zmanim.molad_datetime, shul.time_format, shul.show_seconds, 'Molad') if daily_zmanim.molad_datetime else None,
        'Kiddush Levana Earliest (3 Days)': format_value(daily_zmanim.kiddush_levana_earliest_3_days, shul.time_format, shul.show_seconds, 'Kiddush Levana Earliest (3 Days)') if daily_zmanim.kiddush_levana_earliest_3_days else None,
        'Kiddush Levana Earliest (7 Days)': format_value(daily_zmanim.kiddush_levana_earliest_7_days, shul.time_format, shul.show_seconds, 'Kiddush Levana Earliest (7 Days)') if daily_zmanim.kiddush_levana_earliest_7_days else None,
        'Kiddush Levana Latest (15 Days)': format_value(daily_zmanim.kiddush_levana_latest_15_days, shul.time_format, shul.show_seconds, 'Kiddush Levana Latest (15 Days)') if daily_zmanim.kiddush_levana_latest_15_days else None,
    }

    # Get custom times for today (using DailyZmanim instead of Shul fields)
    weekday = today.weekday()
    # Convert Python weekday (0=Monday) to our model format (0=Sunday)
    day_of_week = (weekday + 1) % 7

    from django.db import models
    # Get all custom times for this shul - we'll filter by day in calculate_time method
    custom_times = CustomTime.objects.filter(shul=shul)

    custom_times_data = []
    for custom_time in custom_times:
        # Note: Custom times will need updating to use DailyZmanim instead of Shul fields
        calculated_time = custom_time.calculate_time(today)
        if calculated_time:
            custom_times_data.append({
                'internal_name': custom_time.internal_name,
                'display_name': custom_time.display_name,
                'time': format_value(calculated_time.time(), shul.time_format, shul.show_seconds),
                'is_daily': custom_time.daily
            })

    # Create formatted Hebrew date
    formatted_hebrew_date = None
    if daily_zmanim.jewish_day and daily_zmanim.jewish_month_name and daily_zmanim.jewish_year:
        # Translate month name based on language
        month_name_lower = daily_zmanim.jewish_month_name.lower().replace(' ', '_')
        translated_month = JEWISH_MONTH_NAMES.get(month_name_lower, {}).get(language, daily_zmanim.jewish_month_name)

        if language in ['he', 'sh', 'ah']:
            # Hebrew format with gematria numerals
            day_hebrew = number_to_gematria(daily_zmanim.jewish_day)
            # For Jewish years, only use last 3 digits (e.g., 5786 -> 786)
            year_short = daily_zmanim.jewish_year % 1000
            year_hebrew = number_to_gematria(year_short)
            formatted_hebrew_date = f"{day_hebrew} {translated_month} {year_hebrew}"
        else:
            # Ashkenazi/Sephardic format with regular numbers
            formatted_hebrew_date = f"{daily_zmanim.jewish_day} {translated_month} {daily_zmanim.jewish_year}"

    # Create display name translations (keep original keys for lookup)
    zmanim_display_names = {key: translate_term(key, language) for key in zmanim_data.keys()}
    limudim_display_names = {key: translate_term(key, language) for key in limudim_data.keys()}
    calendar_display_names = {key: translate_term(key, language) for key in jewish_calendar_data.keys()}

    # Translate tractate names in Daf Yomi values
    translated_limudim = {}
    for key, value in limudim_data.items():
        if key in ['Daf Yomi Bavli', 'Daf Yomi Yerushalmi', 'Daf HaShavua Bavli'] and value:
            translated_limudim[key] = translate_daf_yomi(value, language)
        elif key == 'Amud Yomi Bavli Dirshu' and value:
            translated_limudim[key] = translate_amud_yomi(value, language)
        elif key == 'Mishna Yomis' and value:
            translated_limudim[key] = translate_mishna_yomis(value, language)
        elif key == 'Tehillim Monthly' and value:
            translated_limudim[key] = translate_tehillim(value, language)
        elif key == 'Parsha' and value:
            translated_limudim[key] = translate_parsha(value, language)
        else:
            translated_limudim[key] = value

    return Response({
        'shul': {
            'name': shul.name,
            'language': shul.language,
            'time_format': shul.time_format,
            'show_seconds': shul.show_seconds,
            'timezone': shul.timezone,
            'center_logo': request.build_absolute_uri(shul.center_logo.url) if shul.center_logo else None,
            'center_logo_size': shul.center_logo_size,
            'center_text': shul.center_text,
            'center_text_size': shul.center_text_size,
            'center_text_color': shul.center_text_color,
            'center_text_font': shul.center_text_font,
            'center_vertical_position': shul.center_vertical_position
        },
        'zmanim': zmanim_data,
        'limudim': translated_limudim,
        'jewish_calendar': jewish_calendar_data,
        'zmanim_display_names': zmanim_display_names,
        'limudim_display_names': limudim_display_names,
        'calendar_display_names': calendar_display_names,
        'formatted_hebrew_date': formatted_hebrew_date,
        'custom_times': custom_times_data,
        'current_time': current_time.isoformat(),
        'last_updated': daily_zmanim.updated_at.isoformat() if daily_zmanim.updated_at else None
    })