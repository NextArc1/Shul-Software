from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Sentry debug view (production only)
def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('zmanim_app.urls')),  # Make sure this points to zmanim_app's URLs
]

# Add Sentry debug endpoint in production only
if not settings.DEBUG:
    urlpatterns.append(path('sentry-debug/', trigger_error))

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
