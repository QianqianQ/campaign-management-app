from rest_framework import serializers

from .models import Campaign, CampaignPayout


class CampaignPayoutSerializer(serializers.ModelSerializer):
    is_worldwide = serializers.ReadOnlyField(source='is_worldwide')
    display_country = serializers.ReadOnlyField(source='display_country')

    class Meta:
        model = CampaignPayout
        fields = [
            "id",
            "campaign",
            "country",
            "amount",
            "currency",
            "created_at",
            "updated_at",
            "is_worldwide",
            "display_country",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "is_worldwide",
            "display_country",
        ]


class CampaignSerializer(serializers.ModelSerializer):
    account = serializers.HiddenField(default=serializers.CurrentUserDefault())
    payouts = CampaignPayoutSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = [
            "id",
            "account",
            "title",
            "landing_page_url",
            "is_running",
            "payouts",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
