
from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Django REST Framework login/logout
    path('api-auth/', include('rest_framework.urls')),

    # JWT authentication endpoints
    path(
        'api/v1/auth/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),
    path(
        'api/v1/auth/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

     # User registration
    path('api/v1/auth/', include('apps.accounts.urls')),
]
