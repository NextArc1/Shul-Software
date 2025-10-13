from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    
    # Shul management (admin)
    path('shul/', views.ShulDetailView.as_view(), name='shul_detail'),
    path('shul/update-coordinates/', views.update_coordinates, name='update_coordinates'),
    path('shul/display-layout/', views.display_layout, name='display_layout'),
    
    # Zmanim (admin)
    path('zmanim/', views.get_zmanim, name='get_zmanim'),
    path('zmanim/refresh/', views.refresh_zmanim, name='refresh_zmanim'),
    path('zmanim/range/', views.get_zmanim_range, name='get_zmanim_range'),
    path('zmanim/available-fields/', views.get_available_base_times, name='available_fields'),
    
    # Custom times (admin)
    path('custom-times/', views.CustomTimeListCreateView.as_view(), name='custom_times'),
    path('custom-times/<int:pk>/', views.CustomTimeDetailView.as_view(), name='custom_time_detail'),

    # Custom texts (admin)
    path('custom-texts/', views.CustomTextListCreateView.as_view(), name='custom_texts'),
    path('custom-texts/<int:pk>/', views.CustomTextDetailView.as_view(), name='custom_text_detail'),

    # Master admin endpoints (staff/superuser only)
    path('master-admin/shuls/', views.master_admin_list_shuls, name='master_admin_list_shuls'),
    path('master-admin/shuls/<int:shul_id>/', views.master_admin_shul_detail, name='master_admin_shul_detail'),
    path('master-admin/shuls/<int:shul_id>/delete/', views.master_admin_delete_shul, name='master_admin_delete_shul'),
    path('master-admin/memorial-boxes/', views.global_memorial_boxes, name='global_memorial_boxes'),

    # Master admin: Registration approval workflow
    path('master-admin/registrations/', views.list_pending_registrations, name='list_pending_registrations'),
    path('master-admin/registrations/<int:registration_id>/approve/', views.approve_registration, name='approve_registration'),
    path('master-admin/registrations/<int:registration_id>/reject/', views.reject_registration, name='reject_registration'),
    path('master-admin/registrations/<int:registration_id>/delete/', views.delete_registration_request, name='delete_registration_request'),

    # Public registration endpoints (no authentication required)
    path('registration/request/', views.submit_registration_request, name='submit_registration_request'),
    path('registration/validate/<uuid:token>/', views.validate_registration_token, name='validate_registration_token'),
    path('registration/complete/', views.complete_registration, name='complete_registration'),

    # Public display API (no authentication required)
    path('display/<slug:shul_slug>/', views.shul_display_data, name='shul_display_data'),
]