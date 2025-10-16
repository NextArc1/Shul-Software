from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Shul, CustomTime, CustomText, DailyZmanim, ShulDisplayLayout, GlobalMemorialBoxes, PendingRegistration

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'is_staff')
        read_only_fields = ('id', 'is_staff')
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ShulSerializer(serializers.ModelSerializer):
    admin_email = serializers.EmailField(source='admin.email', read_only=True)
    admin_last_login = serializers.DateTimeField(source='admin.last_login', read_only=True)

    class Meta:
        model = Shul
        fields = '__all__'
        read_only_fields = ('admin', 'slug', 'created_at', 'updated_at', 'last_display_access')
    
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

        # Validate calculation mode specific fields
        calculation_mode = data.get('calculation_mode', 'daily')

        if calculation_mode == 'weekly_target':
            if data.get('target_weekday') is None:
                raise serializers.ValidationError({
                    'target_weekday': 'Target weekday is required when calculation mode is "weekly_target".'
                })
            if not isinstance(data.get('target_weekday'), int) or data.get('target_weekday') < 0 or data.get('target_weekday') > 6:
                raise serializers.ValidationError({
                    'target_weekday': 'Target weekday must be a number between 0 (Sunday) and 6 (Saturday).'
                })

        if calculation_mode == 'specific_date':
            if not data.get('specific_date'):
                raise serializers.ValidationError({
                    'specific_date': 'Specific date is required when calculation mode is "specific_date".'
                })

        # Validate display days selection
        daily = data.get('daily', False)
        days_of_week = data.get('days_of_week', [])
        day_of_week = data.get('day_of_week')  # Legacy field

        if not daily:
            # Not daily - must have at least one day selected for display
            if not days_of_week and day_of_week is None:
                raise serializers.ValidationError({
                    'days_of_week': 'Please select at least one display day, or mark as daily.'
                })

            # Validate days_of_week values
            if days_of_week:
                for day in days_of_week:
                    if not isinstance(day, int) or day < 0 or day > 6:
                        raise serializers.ValidationError({
                            'days_of_week': 'Each day must be a number between 0 (Sunday) and 6 (Saturday).'
                        })

        return data


class CustomTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomText
        fields = '__all__'
        read_only_fields = ('shul', 'created_at', 'updated_at')

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

    def validate_font_color(self, value):
        """Validate hex color format"""
        import re
        if value and not re.match(r'^#[0-9A-Fa-f]{6}$', value):
            raise serializers.ValidationError('Font color must be a valid hex color code (e.g., #ffffff)')
        return value

    def validate(self, data):
        # Validate that internal_name is unique for this shul
        internal_name = data.get('internal_name')
        shul = self.context.get('shul')  # Will be set in the view

        if shul and internal_name:
            # Check if another custom text with this internal_name exists
            existing = CustomText.objects.filter(shul=shul, internal_name=internal_name)

            # Exclude current instance if updating
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)

            if existing.exists():
                raise serializers.ValidationError({
                    'internal_name': f'A custom text with internal name "{internal_name}" already exists for this shul.'
                })

        # Validate text type specific fields
        text_type = data.get('text_type', 'text')

        if text_type == 'text' and not data.get('text_content'):
            raise serializers.ValidationError({
                'text_content': 'Text content is required when type is "text".'
            })

        # Font size validation
        font_size = data.get('font_size')
        if font_size is not None and (font_size < 8 or font_size > 200):
            raise serializers.ValidationError({
                'font_size': 'Font size must be between 8 and 200 pixels.'
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


class GlobalMemorialBoxesSerializer(serializers.ModelSerializer):
    """Serializer for GlobalMemorialBoxes model"""

    class Meta:
        model = GlobalMemorialBoxes
        fields = ('id', 'ilui_nishmat', 'refuah_shleima', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class PendingRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for PendingRegistration requests"""
    reviewed_by_name = serializers.CharField(source='reviewed_by.email', read_only=True)
    is_token_valid = serializers.SerializerMethodField()

    class Meta:
        model = PendingRegistration
        fields = (
            'id', 'organization_name', 'contact_name', 'rabbi', 'email', 'phone',
            'street_address', 'city', 'state', 'zip_code', 'country',
            'address', 'location_description', 'purpose', 'status',
            'approval_token', 'token_used', 'token_expires_at',
            'submitted_at', 'reviewed_at', 'reviewed_by', 'reviewed_by_name',
            'rejection_reason', 'is_token_valid'
        )
        read_only_fields = (
            'id', 'approval_token', 'token_used', 'token_expires_at',
            'submitted_at', 'reviewed_at', 'reviewed_by', 'reviewed_by_name'
        )

    def get_is_token_valid(self, obj):
        return obj.is_token_valid()


class PendingRegistrationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating registration requests (public)"""

    class Meta:
        model = PendingRegistration
        fields = (
            'organization_name', 'contact_name', 'rabbi', 'email', 'phone',
            'street_address', 'city', 'state', 'zip_code', 'country', 'purpose'
        )

    def validate_email(self, value):
        """Check if email is already registered or has a pending request"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered. Please login or use a different email.")

        # Check for existing pending or approved requests with this email
        existing = PendingRegistration.objects.filter(
            email=value,
            status__in=['pending', 'approved']
        ).exists()

        if existing:
            raise serializers.ValidationError("A registration request with this email is already pending review.")

        return value


class CompleteRegistrationSerializer(serializers.Serializer):
    """Serializer for completing registration with approval token"""
    token = serializers.UUIDField()
    password = serializers.CharField(min_length=8, write_only=True)
    shul_name = serializers.CharField(max_length=200, required=False)
    zip_code = serializers.CharField(max_length=10, required=True, allow_blank=False)
    country = serializers.CharField(max_length=100, default='United States')

    def validate_token(self, value):
        """Validate that the token exists and is valid"""
        try:
            registration = PendingRegistration.objects.get(approval_token=value)
        except PendingRegistration.DoesNotExist:
            raise serializers.ValidationError("Invalid registration token.")

        if not registration.is_token_valid():
            if registration.token_used:
                raise serializers.ValidationError("This registration link has already been used.")
            elif registration.status != 'approved':
                raise serializers.ValidationError("This registration has not been approved.")
            else:
                raise serializers.ValidationError("This registration link has expired.")

        return value

    def create(self, validated_data):
        """Create user and shul from approved registration"""
        token = validated_data['token']
        password = validated_data['password']

        # Get the pending registration
        registration = PendingRegistration.objects.get(approval_token=token)

        # Create user
        user = User.objects.create_user(
            username=registration.email,
            email=registration.email
        )
        user.set_password(password)
        user.save()

        # Get location data from form input
        zip_code = validated_data.get('zip_code', '')
        country = validated_data.get('country', 'United States')

        # Use form zipcode if provided, otherwise fall back to registration zipcode
        final_zip_code = zip_code or registration.zip_code
        final_country = country or registration.country

        # Ensure we have a zipcode
        if not final_zip_code:
            raise serializers.ValidationError({
                'zip_code': 'Zip code is required for accurate time calculations.'
            })

        latitude = 0.0
        longitude = 0.0
        timezone = 'America/New_York'

        # Get coordinates from the zipcode using OpenStreetMap Nominatim API (free, no API key needed)
        try:
            import requests
            from .views import fetch_timezone_by_coordinates

            # Use Nominatim API (same as frontend ZipCodeForm)
            query = f"{final_zip_code}, {final_country}"
            api_url = f"https://nominatim.openstreetmap.org/search?format=json&q={requests.utils.quote(query)}&limit=1"

            # Add User-Agent header (required by Nominatim)
            headers = {
                'User-Agent': 'ShulSchedule/1.0'
            }

            response = requests.get(api_url, headers=headers)
            data = response.json()

            if data and len(data) > 0:
                result = data[0]
                latitude = float(result['lat'])
                longitude = float(result['lon'])

                # Get timezone from coordinates
                timezone_result = fetch_timezone_by_coordinates(latitude, longitude)
                if timezone_result:
                    timezone = timezone_result
            else:
                # No results found - invalid zipcode
                raise serializers.ValidationError({
                    'zip_code': f'Could not find location for zip code "{final_zip_code}" in {final_country}. Please verify the zip code is correct.'
                })
        except serializers.ValidationError:
            raise  # Re-raise validation errors
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to get coordinates for {final_zip_code}: {e}")
            raise serializers.ValidationError({
                'zip_code': 'Unable to verify zip code location. Please check your internet connection and try again.'
            })

        # Create shul using registration data
        shul_name = validated_data.get('shul_name', registration.organization_name)
        # Use the formatted address from registration (auto-generated in model)
        full_address = registration.address if registration.address else f"{registration.street_address}, {registration.city}, {registration.state} {registration.zip_code}"

        shul = Shul.objects.create(
            admin=user,
            name=shul_name,
            zip_code=final_zip_code,
            country=final_country,
            address=full_address,
            email=registration.email,
            phone=registration.phone,
            latitude=latitude,
            longitude=longitude,
            timezone=timezone
        )

        # Auto-calculate 6 months of zmanim for new shul if coordinates exist
        if latitude and longitude and latitude != 0.0 and longitude != 0.0:
            from .zmanim_calculator import ZmanimCalculator
            from datetime import date, timedelta
            import logging

            logger = logging.getLogger(__name__)
            logger.info(f"Starting automatic 6-month zmanim calculation for new shul: {shul.name} (ID: {shul.id})")
            logger.info(f"Location: Lat {latitude}, Lon {longitude}, Timezone: {timezone}")

            start_date = date.today()
            end_date = start_date + timedelta(days=180)

            try:
                count = ZmanimCalculator.calculate_date_range(shul, start_date, end_date)
                logger.info(f"Successfully calculated {count} days of zmanim for {shul.name}")
            except Exception as e:
                logger.error(f"Failed to calculate zmanim for {shul.name}: {e}")
        else:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Skipping zmanim calculation for {shul.name} - invalid coordinates (Lat: {latitude}, Lon: {longitude})")

        # Mark token as used
        registration.token_used = True
        registration.save()

        return {'user': user, 'shul': shul, 'registration': registration}