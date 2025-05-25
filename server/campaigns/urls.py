from .views import CampaignViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet, basename="campaign")

urlpatterns = router.urls
