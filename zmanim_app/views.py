import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ShulSettings
from .get_daily_zmanim import get_daily_zmanim  # Import the zmanim function

# Define the function to fetch timezone by coordinates
def fetch_timezone_by_coordinates(latitude, longitude):
    api_url = f"https://timeapi.io/api/TimeZone/coordinate?latitude={latitude}&longitude={longitude}"
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        if 'timeZone' in data:
            return data['timeZone']
        else:
            return None
    return None

# View to get coordinates from either ZIP code or manual entry and store them, along with language and time format settings
@csrf_exempt
def get_coordinates(request):
    if request.method == 'POST':
        body = json.loads(request.body)

        latitude = body.get('latitude')
        longitude = body.get('longitude')
        zip_code = body.get('zip_code')
        country = body.get('country')
        language = body.get('language')
        time_format = body.get('time_format')
        show_seconds = body.get('show_seconds', False)

        # Ensure latitude and longitude are floats
        if latitude and longitude:
            try:
                latitude = float(latitude)
                longitude = float(longitude)
            except ValueError:
                return JsonResponse({'error': 'Invalid coordinates'}, status=400)

            timezone = fetch_timezone_by_coordinates(latitude, longitude)
        else:
            # Else, use the OpenCage API to get the coordinates from the zip code
            api_key = '9ae808e57837477a9c04015b4d12c86f'
            query = f"{zip_code}, {country}"
            api_url = f"https://api.opencagedata.com/geocode/v1/json?q={query}&key={api_key}&limit=1"

            response = requests.get(api_url)
            data = response.json()

            if data and data['results']:
                coordinates = data['results'][0]['geometry']
                latitude = coordinates['lat']
                longitude = coordinates['lng']
                timezone = fetch_timezone_by_coordinates(latitude, longitude)
            else:
                return JsonResponse({'error': 'Coordinates not found'}, status=404)

        # Save the data in the ShulSettings model
        shul_settings = ShulSettings.objects.first()  # Assuming only one ShulSettings instance exists
        if shul_settings:
            shul_settings.zip_code = zip_code if zip_code else ""
            shul_settings.country = country
            shul_settings.latitude = latitude
            shul_settings.longitude = longitude
            shul_settings.timezone = timezone
            shul_settings.language = language
            shul_settings.time_format = time_format
            shul_settings.show_seconds = show_seconds
            shul_settings.save()
        else:
            ShulSettings.objects.create(
                zip_code=zip_code if zip_code else "",
                country=country,
                latitude=latitude,
                longitude=longitude,
                timezone=timezone,
                language=language,
                time_format=time_format,
                show_seconds=show_seconds
            )

        # Call get_daily_zmanim to calculate and store zmanim
        get_daily_zmanim(latitude, longitude)

        return JsonResponse({
            'message': 'Shul settings and zmanim saved successfully',
            'latitude': latitude,
            'longitude': longitude,
            'timezone': timezone,
            'language': language,
            'time_format': time_format,
            'show_seconds': show_seconds
        })

    return JsonResponse({'error': 'Invalid request method'}, status=400)
