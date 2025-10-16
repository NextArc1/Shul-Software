from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils.text import slugify
import uuid
from datetime import timedelta
from django.utils import timezone


class Shul(models.Model):
    """Represents a synagogue with all its settings"""
    LANGUAGE_CHOICES = [
        ('he', 'Hebrew'),
        ('en', 'English'),
        ('a', 'Ashkenazic'),
        ('s', 'Sephardic'),
        ('de', 'German'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('ru', 'Russian'),
        ('pl', 'Polish'),
        ('fi', 'Finnish'),
        ('hu', 'Hungarian'),
        ('ro', 'Romanian'),
        ('ashkenazi_romanian', 'Romanian (Ashk.)'),
        ('uk', 'Ukrainian'),
        ('sh', 'Sephardic + Hebrew'),
        ('ah', 'Ashkenazic + Hebrew'),
    ]

    TIME_FORMAT_CHOICES = [
        ('12h', '12-hour'),
        ('24h', '24-hour'),
    ]

    # Basic info
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shuls')

    # Location settings
    zip_code = models.CharField(max_length=10, blank=True)
    country = models.CharField(max_length=100)
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    timezone = models.CharField(max_length=100)

    # Display settings
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='he')
    time_format = models.CharField(max_length=10, choices=TIME_FORMAT_CHOICES, default='12h')
    show_seconds = models.BooleanField(default=False)

    # Contact info (optional)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)

    # Display customization
    center_logo = models.ImageField(upload_to='shul_logos/', blank=True, null=True)
    center_logo_size = models.IntegerField(default=400, help_text='Logo max height in pixels (100-600)')
    center_text = models.CharField(max_length=500, blank=True)
    center_text_size = models.IntegerField(default=48, help_text='Font size in pixels (24-96)')
    center_text_color = models.CharField(max_length=7, default='#ffc764', help_text='Hex color code')
    center_text_font = models.CharField(max_length=100, default='Arial', help_text='Font family name')
    center_vertical_position = models.IntegerField(default=50, help_text='Vertical position percentage (0=top, 50=center, 100=bottom)')

    # Box 1 (Shabbos Times) styling
    box1_title_font = models.CharField(max_length=100, default='Arial', blank=True, help_text='Font for Box 1 title')
    box1_title_color = models.CharField(max_length=7, default='#ffc764', blank=True, help_text='Color for Box 1 title')
    box1_text_font = models.CharField(max_length=100, default='Arial', blank=True, help_text='Font for Box 1 text')
    box1_text_color = models.CharField(max_length=7, default='#ffc764', blank=True, help_text='Color for Box 1 text')
    box1_text_size = models.IntegerField(default=22, blank=True, help_text='Font size for Box 1 text in pixels')

    # Box 2 (Weekday Times) styling
    box2_title_font = models.CharField(max_length=100, default='Arial', blank=True, help_text='Font for Box 2 title')
    box2_title_color = models.CharField(max_length=7, default='#ffc764', blank=True, help_text='Color for Box 2 title')
    box2_text_font = models.CharField(max_length=100, default='Arial', blank=True, help_text='Font for Box 2 text')
    box2_text_color = models.CharField(max_length=7, default='#ffc764', blank=True, help_text='Color for Box 2 text')
    box2_text_size = models.IntegerField(default=22, blank=True, help_text='Font size for Box 2 text in pixels')

    # Box 3 (Bottom-left) styling
    box3_text_font = models.CharField(max_length=100, default='Arial', blank=True, help_text='Font for Box 3 text')
    box3_text_color = models.CharField(max_length=7, default='#ffc764', blank=True, help_text='Color for Box 3 text')
    box3_text_size = models.IntegerField(default=18, blank=True, help_text='Font size for Box 3 text in pixels')

    # Box 4 (Bottom-right) styling
    box4_text_font = models.CharField(max_length=100, default='Arial', blank=True, help_text='Font for Box 4 text')
    box4_text_color = models.CharField(max_length=7, default='#ffc764', blank=True, help_text='Color for Box 4 text')
    box4_text_size = models.IntegerField(default=18, blank=True, help_text='Font size for Box 4 text in pixels')

    # Uniform outline color for all boxes (4 main + 2 center)
    boxes_outline_color = models.CharField(max_length=7, default='#d4af37', blank=True, help_text='Outline color for all 6 boxes')
    # Uniform background color for all boxes (transparent by default)
    boxes_background_color = models.CharField(max_length=7, default='', blank=True, help_text='Background color for all 6 boxes (leave empty for transparent)')

    # Header styling
    header_text_color = models.CharField(max_length=7, default='#ffc764', blank=True, help_text='Text color for header')
    header_bg_color = models.CharField(max_length=7, default='#162A45', blank=True, help_text='Background color for header')

    # Background customization
    BACKGROUND_TYPE_CHOICES = [
        ('default', 'Default Background'),
        ('color', 'Solid Color'),
        ('image', 'Custom Image'),
    ]
    background_type = models.CharField(max_length=10, choices=BACKGROUND_TYPE_CHOICES, default='default', help_text='Type of background')
    background_color = models.CharField(max_length=7, default='#000000', blank=True, help_text='Background color for solid color option')
    background_image = models.ImageField(upload_to='backgrounds/', blank=True, null=True, help_text='Custom background image')

    # Memorial boxes (editable only by master admin)
    ilui_nishmat = models.JSONField(default=list, blank=True, help_text='List of names for Ilui Nishmat (In Memory Of)')
    refuah_shleima = models.JSONField(default=list, blank=True, help_text='List of names for Refuah Shleima (Complete Healing)')

    # Status and tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    last_display_access = models.DateTimeField(null=True, blank=True, help_text='Last time the display page was accessed')
    
    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            # Ensure uniqueness
            while Shul.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_zmanim_for_date(self, target_date):
        """Helper method to get zmanim for a specific date"""
        from datetime import date
        if isinstance(target_date, str):
            target_date = date.fromisoformat(target_date)
        return DailyZmanim.objects.filter(shul=self, date=target_date).first()

    def get_todays_zmanim(self):
        """Helper method to get today's zmanim"""
        from datetime import date
        return self.get_zmanim_for_date(date.today())


class DailyZmanim(models.Model):
    """Pre-calculated zmanim for a specific shul on a specific date"""
    shul = models.ForeignKey(Shul, on_delete=models.CASCADE, related_name='daily_zmanim')
    date = models.DateField()

    # ========== BASIC ZMANIM TIMES (14 fields) ==========
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

    # ========== ADDITIONAL ZMANIM TIMES (12 fields) ==========
    # Sea level & elevation adjusted
    sea_level_sunrise = models.TimeField(null=True, blank=True)
    sea_level_sunset = models.TimeField(null=True, blank=True)
    elevation_adjusted_sunrise = models.TimeField(null=True, blank=True)
    elevation_adjusted_sunset = models.TimeField(null=True, blank=True)

    # Alos at different degrees
    alos_16_1 = models.TimeField(null=True, blank=True)
    alos_18 = models.TimeField(null=True, blank=True)
    alos_19_8 = models.TimeField(null=True, blank=True)

    # Tzais at different degrees
    tzais_8_5 = models.TimeField(null=True, blank=True)
    tzais_7_083 = models.TimeField(null=True, blank=True)
    tzais_5_95 = models.TimeField(null=True, blank=True)
    tzais_6_45 = models.TimeField(null=True, blank=True)

    # Sun transit
    sun_transit = models.TimeField(null=True, blank=True)

    # ========== HALACHIC HOURS (3 fields) ==========
    # Stored in milliseconds as FloatField
    shaah_zmanis_gra = models.FloatField(null=True, blank=True)
    shaah_zmanis_mga = models.FloatField(null=True, blank=True)
    temporal_hour = models.FloatField(null=True, blank=True)

    # ========== JEWISH CALENDAR - DATE INFO (5 fields) ==========
    jewish_year = models.IntegerField(null=True, blank=True)
    jewish_month = models.IntegerField(null=True, blank=True)
    jewish_month_name = models.CharField(max_length=50, blank=True)
    jewish_day = models.IntegerField(null=True, blank=True)
    day_of_week = models.IntegerField(null=True, blank=True)  # 0=Sunday

    # ========== JEWISH CALENDAR - SPECIAL DAYS (3 fields) ==========
    significant_day = models.CharField(max_length=100, blank=True)
    day_of_omer = models.IntegerField(null=True, blank=True)
    day_of_chanukah = models.IntegerField(null=True, blank=True)

    # ========== JEWISH CALENDAR - BOOLEAN FLAGS (8 fields) ==========
    is_rosh_chodesh = models.BooleanField(default=False)
    is_yom_tov = models.BooleanField(default=False)
    is_chol_hamoed = models.BooleanField(default=False)
    is_erev_yom_tov = models.BooleanField(default=False)
    is_chanukah = models.BooleanField(default=False)
    is_taanis = models.BooleanField(default=False)
    is_assur_bemelacha = models.BooleanField(default=False)
    is_erev_rosh_chodesh = models.BooleanField(default=False)

    # ========== JEWISH CALENDAR - MOLAD (1 field) ==========
    molad_datetime = models.DateTimeField(null=True, blank=True)

    # ========== JEWISH CALENDAR - KIDDUSH LEVANA (3 fields) ==========
    kiddush_levana_earliest_3_days = models.DateTimeField(null=True, blank=True)
    kiddush_levana_earliest_7_days = models.DateTimeField(null=True, blank=True)
    kiddush_levana_latest_15_days = models.DateTimeField(null=True, blank=True)

    # ========== BASIC LEARNING SCHEDULE (5 fields) ==========
    parsha = models.CharField(max_length=100, blank=True)
    daf_yomi_bavli = models.CharField(max_length=100, blank=True)
    mishna_yomis = models.CharField(max_length=100, blank=True)
    tehillim_monthly = models.CharField(max_length=100, blank=True)
    daf_yomi_yerushalmi = models.CharField(max_length=100, blank=True)

    # ========== ADDITIONAL LEARNING SCHEDULES (3 fields) ==========
    pirkei_avos = models.CharField(max_length=100, blank=True)
    daf_hashavua_bavli = models.CharField(max_length=100, blank=True)
    amud_yomi_bavli_dirshu = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['shul', 'date']
        ordering = ['date']
        indexes = [
            models.Index(fields=['shul', 'date']),
        ]
        verbose_name_plural = 'Daily Zmanim'

    def __str__(self):
        return f"{self.shul.name} - {self.date}"

    @classmethod
    def get_for_date(cls, shul, target_date):
        """Get zmanim for a specific date"""
        return cls.objects.filter(shul=shul, date=target_date).first()

    @classmethod
    def get_range(cls, shul, start_date, end_date):
        """Get zmanim for a date range"""
        return cls.objects.filter(shul=shul, date__range=[start_date, end_date]).order_by('date')


class ShulDisplayLayout(models.Model):
    """Store the display layout configuration for each shul's settings page"""
    shul = models.OneToOneField('Shul', on_delete=models.CASCADE, related_name='display_layout')

    # Store box configurations as JSON
    # Format: {
    #   "box1": {"displayName": "Box 1", "items": [{"id": "zmanim_alos", "name": "Alos HaShachar"}]},
    #   "box2": {"displayName": "Box 2", "items": []},
    #   ...
    # }
    layout_config = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Shul Display Layout'
        verbose_name_plural = 'Shul Display Layouts'

    def __str__(self):
        return f"Display Layout for {self.shul.name}"


class CustomTime(models.Model):
    """Custom times specific to each shul"""
    TIME_TYPE_CHOICES = [
        ('fixed', 'Fixed Time'),
        ('dynamic', 'Dynamic Time'),
    ]
    DAY_OF_WEEK_CHOICES = [
        (0, 'Sunday'),
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
    ]

    shul = models.ForeignKey('Shul', on_delete=models.CASCADE, related_name='custom_times', null=True, blank=True)
    internal_name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, help_text='Optional notes/description for this custom time')
    time_type = models.CharField(max_length=10, choices=TIME_TYPE_CHOICES)
    base_time = models.CharField(max_length=100, null=True, blank=True)
    offset_minutes = models.IntegerField(default=0)
    fixed_time = models.TimeField(null=True, blank=True)
    daily = models.BooleanField(default=False)
    days_of_week = models.JSONField(default=list, blank=True, help_text='List of days (0=Sunday, 6=Saturday)')
    # Legacy field - kept for backwards compatibility
    day_of_week = models.IntegerField(choices=DAY_OF_WEEK_CHOICES, null=True, blank=True)
    calculated_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['shul', 'internal_name']

    def __str__(self):
        return f"{self.shul.name} - {self.display_name}"

    def calculate_time(self, target_date=None):
        from datetime import datetime, timedelta, date, time as dt_time
        import logging

        logger = logging.getLogger(__name__)

        if target_date is None:
            target_date = date.today()

        if self.daily:
            # Daily - applies to all days
            pass
        else:
            # Check if this custom time applies to the target date
            # Convert Python weekday (0=Monday) to our model format (0=Sunday)
            target_day_of_week = (target_date.weekday() + 1) % 7

            # Support both new (days_of_week list) and legacy (day_of_week single int)
            applicable_days = self.days_of_week if self.days_of_week else []
            if not applicable_days and self.day_of_week is not None:
                # Legacy: single day_of_week
                applicable_days = [self.day_of_week]

            if not applicable_days:
                logger.info(f"Custom time '{self.display_name}' has no applicable days and is not daily.")
                return None

            if target_day_of_week not in applicable_days:
                # This custom time doesn't apply to this day
                logger.info(f"Custom time '{self.display_name}' does not apply on day {target_day_of_week} (target: {target_date})")
                return None

        logger.info(f"Calculating custom time '{self.display_name}' for target date {target_date}")

        if self.time_type == 'fixed':
            fixed_time = self.fixed_time
            calculated_datetime = datetime.combine(target_date, fixed_time)
            return calculated_datetime
        elif self.time_type == 'dynamic':
            try:
                # Get zmanim from DailyZmanim table for the target date
                daily_zmanim = DailyZmanim.objects.filter(shul=self.shul, date=target_date).first()

                if not daily_zmanim:
                    logger.error(f"No DailyZmanim found for {self.shul.name} on {target_date}")
                    return None

                # Get the base time field value from DailyZmanim
                base_time_field = self.base_time
                logger.info(f"Calculating custom time for base_time_field: {base_time_field}")

                base_time_value = getattr(daily_zmanim, base_time_field, None)

                if base_time_value is None:
                    logger.error(f"Base time '{base_time_field}' is None for {target_date}")
                    return None

                # Handle different field types
                if isinstance(base_time_value, dt_time):
                    # It's a TimeField - combine with target date
                    base_datetime = datetime.combine(target_date, base_time_value)
                elif isinstance(base_time_value, datetime):
                    # It's already a datetime (molad, kiddush levana fields)
                    base_datetime = base_time_value
                else:
                    # It's not a time field (could be string, int, bool, float)
                    logger.error(f"Base time '{base_time_field}' is not a time/datetime field (type: {type(base_time_value)})")
                    return None

                # Apply offset
                calculated_datetime = base_datetime + timedelta(minutes=self.offset_minutes)
                return calculated_datetime

            except Exception as e:
                logger.error(f"Error calculating custom time: {e}")
                return None
        else:
            logger.error(f"Unknown time_type '{self.time_type}' for custom time '{self.display_name}'")
            return None


class CustomText(models.Model):
    """Custom text fields and dividers specific to each shul"""
    TEXT_TYPE_CHOICES = [
        ('text', 'Text'),
        ('divider', 'Divider'),
    ]

    shul = models.ForeignKey('Shul', on_delete=models.CASCADE, related_name='custom_texts', null=True, blank=True)
    internal_name = models.CharField(max_length=100, help_text='Unique identifier (lowercase, no spaces)')
    display_name = models.CharField(max_length=100, help_text='Label that appears on display')
    text_type = models.CharField(max_length=10, choices=TEXT_TYPE_CHOICES, default='text')
    text_content = models.TextField(blank=True, help_text='The text content to display (not needed for dividers)')
    font_size = models.IntegerField(null=True, blank=True, help_text='Font size in pixels (leave empty to inherit from box)')
    font_color = models.CharField(max_length=7, blank=True, help_text='Hex color code (e.g., #ffffff)')
    description = models.TextField(blank=True, help_text='Optional notes/description')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['shul', 'internal_name']
        verbose_name = 'Custom Text'
        verbose_name_plural = 'Custom Texts'
        ordering = ['display_name']

    def __str__(self):
        return f"{self.shul.name} - {self.display_name} ({self.get_text_type_display()})"


class GlobalMemorialBoxes(models.Model):
    """Global memorial boxes that apply to all shuls (singleton)"""
    ilui_nishmat = models.JSONField(default=list, blank=True, help_text='List of names for Ilui Nishmat (In Memory Of)')
    refuah_shleima = models.JSONField(default=list, blank=True, help_text='List of names for Refuah Shleima (Complete Healing)')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Global Memorial Boxes'
        verbose_name_plural = 'Global Memorial Boxes'

    def __str__(self):
        return "Global Memorial Boxes"

    @classmethod
    def get_instance(cls):
        """Get or create the singleton instance"""
        instance, created = cls.objects.get_or_create(pk=1)
        return instance


class PendingRegistration(models.Model):
    """Pending registration requests that need admin approval"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    # Registration info
    organization_name = models.CharField(max_length=200, help_text='Name of the shul/organization')
    contact_name = models.CharField(max_length=200, help_text='Full name of contact person')
    rabbi = models.CharField(max_length=200, blank=True, help_text='Name of the rabbi (optional)')
    email = models.EmailField(help_text='Email address for account')
    phone = models.CharField(max_length=20, help_text='Phone number')

    # Address fields (separated)
    street_address = models.CharField(max_length=300, default='', help_text='Street address')
    city = models.CharField(max_length=100, default='', help_text='City')
    state = models.CharField(max_length=100, default='', help_text='State/Province/Region')
    zip_code = models.CharField(max_length=20, default='', help_text='Zip/Postal Code')
    country = models.CharField(max_length=100, default='United States', help_text='Country')

    # Legacy fields (kept for backwards compatibility)
    address = models.TextField(blank=True, help_text='Full formatted address (auto-populated)')
    location_description = models.CharField(max_length=200, blank=True, help_text='City, State/Country (auto-populated)')

    purpose = models.TextField(help_text='Why they need this service')

    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Token for account creation
    approval_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    token_used = models.BooleanField(default=False)
    token_expires_at = models.DateTimeField(null=True, blank=True)

    # Metadata
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='reviewed_registrations')
    rejection_reason = models.TextField(blank=True, help_text='Reason for rejection (optional)')

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Pending Registration'
        verbose_name_plural = 'Pending Registrations'

    def __str__(self):
        return f"{self.organization_name} - {self.email} ({self.status})"

    def save(self, *args, **kwargs):
        # Auto-populate legacy fields from new address fields
        if self.street_address or self.city or self.state:
            self.address = f"{self.street_address}\n{self.city}, {self.state} {self.zip_code}\n{self.country}"
            self.location_description = f"{self.city}, {self.state}, {self.country}"

        # Set token expiration when approved (7 days from now)
        if self.status == 'approved' and not self.token_expires_at:
            self.token_expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def is_token_valid(self):
        """Check if the approval token is still valid"""
        if self.token_used:
            return False
        if self.status != 'approved':
            return False
        if self.token_expires_at and timezone.now() > self.token_expires_at:
            return False
        return True