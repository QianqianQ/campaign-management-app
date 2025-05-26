from rest_framework import serializers
from django.db import transaction

from .models import Campaign, CampaignPayout


class CampaignPayoutSerializer(serializers.ModelSerializer):
    is_worldwide = serializers.ReadOnlyField()
    display_country = serializers.ReadOnlyField()

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
        # campaign is not required for create action
        extra_kwargs = {
            "campaign": {"required": False},
        }

    def validate(self, attrs):
        country = attrs.get("country")
        campaign = attrs.get("campaign")

        # Skip validation during campaign creation
        if not campaign:
            return attrs

        # Get all payouts for this campaign in a single query
        payouts = CampaignPayout.objects.filter(campaign=campaign)
        if self.instance:
            payouts = payouts.exclude(pk=self.instance.pk)

        # Check both conditions from the same queryset
        has_worldwide = payouts.filter(country__isnull=True).exists()
        has_countries = payouts.filter(country__isnull=False).exists()

        # Validate based on the current payout type
        if country is None:  # Worldwide payout
            if has_countries:
                raise serializers.ValidationError(
                    "Cannot add worldwide payout when country-specific payouts exist")
            if has_worldwide:
                raise serializers.ValidationError(
                    "A worldwide payout already exists for this campaign")
        else:  # Country-specific payout
            if has_worldwide:
                raise serializers.ValidationError(
                    "Cannot add country-specific payout when worldwide payout exists")
            # Check for duplicate country
            if payouts.filter(country=country).exists():
                raise serializers.ValidationError(
                    f"A payout for {country.name} already exists in this campaign")

        return attrs


class CampaignSerializer(serializers.ModelSerializer):
    account = serializers.HiddenField(default=serializers.CurrentUserDefault())
    payouts = serializers.ListField(write_only=True, required=False)

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

    def validate_title(self, title):
        # Check if a campaign with this title already exists
        if Campaign.objects.filter(
            account=self.context['request'].user,
            title=title
        ).exists():
            raise serializers.ValidationError(
                "A campaign with this title already exists")
        return title

    def validate_payouts(self, payouts):
        if not payouts or not isinstance(payouts, list):
            raise serializers.ValidationError(
                "At least one payout is required")

        # Validate each payout
        for payout in payouts:
            if not isinstance(payout, dict):
                raise serializers.ValidationError(
                    "Each payout must be an object")

            required_fields = ['amount', 'currency']
            for field in required_fields:
                if field not in payout:
                    raise serializers.ValidationError(
                        f"Payout must include {field}")

            if not isinstance(payout['amount'], (int, float)):
                raise serializers.ValidationError(
                    "Amount must be a number")

            if not isinstance(payout['currency'], str):
                raise serializers.ValidationError(
                    "Currency must be a string")

        # Check for mixing worldwide and country-specific payouts
        has_worldwide = any(payout.get("country") is None for payout in payouts)
        has_countries = any(payout.get("country") is not None for payout in payouts)
        if has_worldwide and has_countries:
            raise serializers.ValidationError(
                "Cannot mix worldwide and country-specific payouts")

        # Check for duplicate country payouts
        country_payouts = [payout.get("country")
                         for payout in payouts if payout.get("country")]
        if len(country_payouts) != len(set(country_payouts)):
            raise serializers.ValidationError(
                "Duplicate country payouts are not allowed")

        return payouts

    def create(self, validated_data):
        payouts_data = validated_data.pop('payouts', [])

        with transaction.atomic():
            campaign = Campaign.objects.create(**validated_data)

            # Create payouts
            for payout_data in payouts_data:
                payout_data['campaign'] = campaign.id
                payout_serializer = CampaignPayoutSerializer(
                    data=payout_data)
                payout_serializer.is_valid(raise_exception=True)
                payout_serializer.save()
            return campaign


class CampaignListSerializer(serializers.ModelSerializer):
    payouts = CampaignPayoutSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = [
            "id",
            "title",
            "landing_page_url",
            "is_running",
            "payouts",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
