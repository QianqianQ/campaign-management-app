import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from campaigns.models import Campaign, CampaignPayout

User = get_user_model()


@pytest.fixture
def test_user(db):
    email = 'test@test.com'
    password = 'Password123!'
    # Create user with email as username
    user = User.objects.create_user(
        username=email, email=email, password=password
    )
    return user


@pytest.fixture
def auth_client(test_user):
    refresh = RefreshToken.for_user(test_user)
    client = APIClient()
    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}"
    )
    return client


@pytest.fixture
def unauth_client():
    return APIClient()


@pytest.fixture
def sample_campaign_data():
    return {
        "title": "Promotion Campaign",
        "landing_page_url": "https://example.com/spring-promotion",
        "is_running": True,
        "payouts": [
            {"country": "US", "amount": 100.00, "currency": "USD"},
            {"country": "CA", "amount": 90.00, "currency": "EUR"}
        ]
    }


@pytest.fixture
def sample_campaign_instance(test_user, sample_campaign_data):
    campaign_data = sample_campaign_data.copy()
    # Remove payouts from campaign data as they need to be created separately
    payouts_data = campaign_data.pop('payouts', [])
    campaign_data['account'] = test_user
    campaign = Campaign.objects.create(**campaign_data)

    # Create the payouts
    for payout_data in payouts_data:
        CampaignPayout.objects.create(
            campaign=campaign,
            **payout_data
        )

    return campaign
