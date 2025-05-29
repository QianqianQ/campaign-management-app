import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestCampaigns:
    # TODO: add more testcases for campaigns
    # testcases:
    # testcase for create campaign
    # testcase for create campaign with invalid landing_page_url
    # testcase for create campaign with invalid payouts
    # testcase for create campaign with invalid account

    # tescase for edit campaign
    # testcase for edit campaign with invalid id
    # testcase for edit campaign with invalid landing_page_url
    # testcase for edit campaign with invalid payouts
    # testcase for edit campaign with invalid account

    # tescase for delete campaign

    # tescase for list campaigns
    # tescase for get campaign
    # tescase for get campaign with invalid id

    def test_create_campaign_auth(self, auth_client, sample_campaign_data):
        url = reverse("campaign-list")
        response = auth_client.post(url, sample_campaign_data, format="json")
        assert response.status_code == 201
        assert response.data["title"] == "Promotion Campaign"
        assert response.data["landing_page_url"] == (
            "https://example.com/spring-promotion"
        )
        assert response.data["is_running"] is True

        us_payout = next(p for p in response.data["payouts"] if p["currency"] == "USD")
        ca_payout = next(p for p in response.data["payouts"] if p["currency"] == "EUR")

        assert us_payout["display_country"] == "United States of America"
        assert us_payout["amount"] == "100.00"
        assert ca_payout["display_country"] == "Canada"
        assert ca_payout["amount"] == "90.00"

    def test_create_campaign_unauthenticated(self, unauth_client, sample_campaign_data):
        """Test creating a campaign without authentication fails"""
        url = reverse("campaign-list")
        response = unauth_client.post(url, sample_campaign_data, format="json")

        assert response.status_code == 401

    def test_list_campaigns_auth(self, auth_client, sample_campaign_instance):
        """Test listing campaigns for authenticated user"""
        url = reverse("campaign-list")
        response = auth_client.get(url)

        assert response.status_code == 200
        assert len(response.data) >= 1
        # Check if our sample campaign is in the list
        campaign_names = [campaign["title"] for campaign in response.data]
        assert sample_campaign_instance.title in campaign_names
