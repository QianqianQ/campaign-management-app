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

        if self.instance:
            # update action, exclude the current instance from the validation
            qs = CampaignPayout.objects.filter(campaign=campaign).exclude(
                pk=self.instance.pk)
        else:
            # create action
            qs = CampaignPayout.objects.filter(campaign=campaign)

        if country is None:
            # if country is None, check if there is already a worldwide payout
            if qs.filter(country__isnull=True).exists():
                raise serializers.ValidationError(
                    "A worldwide payout already exists for this campaign.")
        else:
            # if country is not None, check if there is already a payout for the country
            if qs.filter(country=country).exists():
                raise serializers.ValidationError(
                    f"A payout for {country.name} already exists in this campaign.")

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
