from django.contrib import admin
from .models import Shul, CustomTime, DailyZmanim


@admin.register(Shul)
class ShulAdmin(admin.ModelAdmin):
    list_display = ('name', 'admin', 'country', 'is_active', 'created_at')
    list_filter = ('country', 'language', 'time_format', 'is_active', 'created_at')
    search_fields = ('name', 'admin__email', 'country', 'zip_code')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'admin', 'is_active')
        }),
        ('Location', {
            'fields': ('zip_code', 'country', 'latitude', 'longitude', 'timezone')
        }),
        ('Display Settings', {
            'fields': ('language', 'time_format', 'show_seconds')
        }),
        ('Contact Info', {
            'fields': ('address', 'phone', 'email', 'website'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(DailyZmanim)
class DailyZmanimAdmin(admin.ModelAdmin):
    list_display = ('shul', 'date', 'hanetz', 'shkia', 'created_at')
    list_filter = ('date', 'shul__country', 'created_at')
    search_fields = ('shul__name', 'date')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'date'

    fieldsets = (
        ('Basic Info', {
            'fields': ('shul', 'date')
        }),
        ('Zmanim Times', {
            'fields': (
                'alos', 'hanetz', 'chatzos', 'mincha_gedola', 'mincha_ketana',
                'plag_hamincha', 'shkia', 'tzais', 'tzais_72',
                'sof_zman_krias_shema_gra', 'sof_zman_krias_shema_mga',
                'sof_zman_tfila_gra', 'sof_zman_tfila_mga', 'candle_lighting'
            )
        }),
        ('Learning Schedule', {
            'fields': ('parsha', 'daf_yomi_bavli', 'mishna_yomis', 'tehillim_monthly', 'daf_yomi_yerushalmi')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CustomTime)
class CustomTimeAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'shul', 'time_type', 'daily', 'day_of_week')
    list_filter = ('time_type', 'daily', 'day_of_week', 'shul__country')
    search_fields = ('display_name', 'internal_name', 'shul__name')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('shul', 'internal_name', 'display_name', 'time_type')
        }),
        ('Fixed Time Settings', {
            'fields': ('fixed_time',),
            'classes': ('collapse',)
        }),
        ('Dynamic Time Settings', {
            'fields': ('base_time', 'offset_minutes'),
            'classes': ('collapse',)
        }),
        ('Schedule', {
            'fields': ('daily', 'day_of_week', 'calculated_time')
        }),
    )