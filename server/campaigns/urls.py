from rest_framework.routers import DefaultRouter

from .views import CampaignPayoutViewSet, CampaignViewSet

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet, basename="campaign")
router.register(r"payouts", CampaignPayoutViewSet, basename="campaign-payout")

urlpatterns = router.urls
