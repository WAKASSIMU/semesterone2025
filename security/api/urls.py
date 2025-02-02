from django.urls import path
from app import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # For logging in
    TokenRefreshView,     # For refreshing the JWT token
)

urlpatterns = [
    # API endpoints for various resources
    path('order/', views.manage_order),
    path('order/<int:pk>/', views.manage_order),

    path('organization/', views.manage_Organization),
    path('organization/<int:pk>/', views.manage_Organization),

    path('armedsecurityguard/', views.manage_ArmedSecurityGuard),
    path('armedsecurityguard/<int:pk>/', views.manage_ArmedSecurityGuard),
    
    path('securityoffice/', views.manage_SecurityOffice),
    path('securityoffice/<int:pk>/', views.manage_SecurityOffice),

    # JWT authentication URLs
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtain JWT token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh JWT token

    # User-related URL
    # path('users/me/', views.curent_user , name='current_user'),  # Get current user info
]
