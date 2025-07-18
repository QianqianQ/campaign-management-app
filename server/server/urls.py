"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from . import views

# for testing sentry
def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path("sentry-debug/", trigger_error),
    path("", views.index, name="index"),
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("campaigns.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
