from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Shul, CustomTime, DailyZmanim, ShulDisplayLayout

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password')
        read_only_fields = ('id',)
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ShulSerializer(serializers.ModelSerializer):
    admin_email = serializers.EmailField(source='admin.email', read_only=True)

    class Meta:
        model = Shul
        fields = '__all__'
        read_only_fields = ('admin', 'slug', 'created_at', 'updated_at')
    
    def update(self, instance, validated_data):
        # Check if coordinates are being updated
        latitude = validated_data.get('latitude', instance.latitude)
        longitude = validated_data.get('longitude', instance.longitude)

        # If coordinates changed, update timezone
        if (latitude != instance.latitude or longitude != instance.longitude) and latitude and longitude:
            from .views import fetch_timezone_by_coordinates
            timezone = fetch_timezone_by_coordinates(latitude, longitude)
            if timezone:
                validated_data['timezone'] = timezone

        # Update the instance
        instance = super().update(instance, validated_data)

        # Trigger zmanim recalculation if coordinates changed
        if (latitude != instance.latitude or longitude != instance.longitude) and latitude and longitude:
            from .tasks import recalculate_shul_zmanim
            from datetime import date
            recalculate_shul_zmanim.delay(instance.id, from_date=date.today())

        return instance


class CustomTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomTime
        fields = '__all__'
        read_only_fields = ('shul', 'calculated_time')

    def validate_internal_name(self, value):
        """Validate internal name format"""
        import re

        # Check for spaces
        if ' ' in value:
            raise serializers.ValidationError('Internal name cannot contain spaces. Use underscores (_) instead.')

        # Check for special characters (only allow letters, numbers, underscores, hyphens)
        if not re.match(r'^[a-zA-Z0-9_-]+$', value):
            raise serializers.ValidationError('Internal name can only contain letters, numbers, underscores, and hyphens.')

        # Check length
        if len(value) < 3:
            raise serializers.ValidationError('Internal name must be at least 3 characters long.')

        return value.lower()  # Convert to lowercase for consistency

    def validate(self, data):
        # Validate that internal_name is unique for this shul
        internal_name = data.get('internal_name')
        shul = self.context.get('shul')  # Will be set in the view

        if shul and internal_name:
            # Check if another custom time with this internal_name exists
            existing = CustomTime.objects.filter(shul=shul, internal_name=internal_name)

            # Exclude current instance if updating
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)

            if existing.exists():
                raise serializers.ValidationError({
                    'internal_name': f'A custom time with internal name "{internal_name}" already exists for this shul.'
                })

        # Validate time type specific fields
        time_type = data.get('time_type')

        if time_type == 'fixed' and not data.get('fixed_time'):
            raise serializers.ValidationError({
                'fixed_time': 'Fixed time is required when time type is "fixed".'
            })

        if time_type == 'dynamic':
            if not data.get('base_time'):
                raise serializers.ValidationError({
                    'base_time': 'Base time is required when time type is "dynamic".'
                })

        # Validate days selection
        daily = data.get('daily', False)
        days_of_week = data.get('days_of_week', [])
        day_of_week = data.get('day_of_week')  # Legacy field

        if not daily:
            # Not daily - must have at least one day selected
            if not days_of_week and day_of_week is None:
                raise serializers.ValidationError({
                    'days_of_week': 'Please select at least one day, or mark as daily.'
                })

            # Validate days_of_week values
            if days_of_week:
                for day in days_of_week:
                    if not isinstance(day, int) or day < 0 or day > 6:
                        raise serializers.ValidationError({
                            'days_of_week': 'Each day must be a number between 0 (Sunday) and 6 (Saturday).'
                        })

        return data


class RegistrationSerializer(serializers.Serializer):
    # User fields
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    
    # Shul fields
    shul_name = serializers.CharField(max_length=200)
    zip_code = serializers.CharField(max_length=10, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, default='United States')
    latitude = serializers.FloatField(required=False, default=0.0)
    longitude = serializers.FloatField(required=False, default=0.0)
    timezone = serializers.CharField(max_length=100, required=False, default='America/New_York')
    language = serializers.ChoiceField(choices=Shul.LANGUAGE_CHOICES, default='s')
    time_format = serializers.ChoiceField(choices=Shul.TIME_FORMAT_CHOICES, default='12h')
    show_seconds = serializers.BooleanField(default=False)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value
    
    def create(self, validated_data):
        # Extract user data
        email = validated_data.pop('email')
        phone = validated_data.pop('phone', '')  # Extract phone but don't pass to User model
        password = validated_data.pop('password')
        
        # Create user (Django User model doesn't have phone field)
        user = User.objects.create_user(
            username=email,
            email=email
        )
        user.set_password(password)
        user.save()
        
        # Extract and process location data
        zip_code = validated_data.get('zip_code')
        country = validated_data.get('country', 'United States')
        latitude = validated_data.get('latitude', 0.0)
        longitude = validated_data.get('longitude', 0.0)
        timezone = validated_data.get('timezone', 'America/New_York')
        
        # Try to get coordinates from zip code if not provided
        if zip_code and (not latitude or not longitude):
            try:
                import requests
                from decouple import config
                api_key = config('OPENCAGE_API_KEY')
                query = f"{zip_code}, {country}"
                api_url = f"https://api.opencagedata.com/geocode/v1/json?q={query}&key={api_key}&limit=1"
                
                response = requests.get(api_url)
                data = response.json()
                
                if data and data['results']:
                    coordinates = data['results'][0]['geometry']
                    latitude = coordinates['lat']
                    longitude = coordinates['lng']
                    
                    # Get timezone
                    from .views import fetch_timezone_by_coordinates
                    timezone_result = fetch_timezone_by_coordinates(latitude, longitude)
                    if timezone_result:
                        timezone = timezone_result
            except Exception as e:
                print(f"Failed to get coordinates: {e}")
                # Continue with default coordinates
        
        # Create shul
        shul = Shul.objects.create(
            admin=user,
            name=validated_data.pop('shul_name'),
            zip_code=zip_code,
            country=country,
            latitude=latitude,
            longitude=longitude,
            timezone=timezone,
            language=validated_data.get('language', 's'),
            time_format=validated_data.get('time_format', '12h'),
            show_seconds=validated_data.get('show_seconds', False)
        )
        
        # Auto-calculate 6 months of zmanim for new shul
        if latitude and longitude and latitude != 0.0 and longitude != 0.0:
            from .zmanim_calculator import ZmanimCalculator
            from datetime import date, timedelta

            start_date = date.today()
            end_date = start_date + timedelta(days=180)
            ZmanimCalculator.calculate_date_range(shul, start_date, end_date)

        return {'user': user, 'shul': shul}


class DailyZmanimSerializer(serializers.ModelSerializer):
    """Serializer for DailyZmanim model"""
    shul_name = serializers.CharField(source='shul.name', read_only=True)

    class Meta:
        model = DailyZmanim
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class ShulDisplayLayoutSerializer(serializers.ModelSerializer):
    """Serializer for ShulDisplayLayout model"""

    class Meta:
        model = ShulDisplayLayout
        fields = ('id', 'shul', 'layout_config', 'created_at', 'updated_at')
        read_only_fields = ('id', 'shul', 'created_at', 'updated_at')