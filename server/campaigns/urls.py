from .views import CampaignViewSet, CampaignPayoutViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet, basename="campaign")
router.register(r"payouts", CampaignPayoutViewSet, basename="campaign-payout")

urlpatterns = router.urls
