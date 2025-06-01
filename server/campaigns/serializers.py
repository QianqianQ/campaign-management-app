"""
Campaign serializers for API endpoints.

This module contains serializers for Campaign and CampaignPayout models
with optimized queries and comprehensive validation.
"""

from __future__ import annotations

from typing import Any, Dict, List

from django.db import transaction
from rest_framework import serializers

from .models import Campaign, CampaignPayout


class CampaignPayoutSerializer(serializers.ModelSerializer):
    """
    Serializer for CampaignPayout model.

    Handles serialization/deserialization of campaign payout data
    with custom validation for business rules.
    """

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
        extra_kwargs = {
            "campaign": {"required": False},
        }

    def to_representation(self, instance: CampaignPayout) -> Dict[str, Any]:
        """
        Custom representation for country field.

        Args:
            instance: CampaignPayout instance

        Returns:
            Serialized data with formatted country information
        """
        data = super().to_representation(instance)
        if instance.country:
            country_name = instance.country.name
            country_code = instance.country.code
            data["country"] = f"{country_name} ({country_code})"
        else:
            data["country"] = "Worldwide"
        return data

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate payout data ensuring business rules.

        Args:
            attrs: Validated data attributes

        Returns:
            Validated attributes

        Raises:
            ValidationError: If business rules are violated
        """
        campaign = attrs.get("campaign") or (
            self.instance.campaign if self.instance else None
        )

        # Skip validation during campaign creation when no campaign is set yet
        if not campaign:
            return attrs

        # Check if worldwide or specific payout already exists
        country = attrs.get("country")
        # Get all payouts for this campaign
        payouts = CampaignPayout.objects.filter(campaign=campaign)
        if self.instance:
            # Exclude current instance from payouts
            payouts = payouts.exclude(pk=self.instance.pk)

        # Check if worldwide or any country-specific payout already exists
        has_worldwide = payouts.filter(country__isnull=True).exists()
        has_countries = payouts.filter(country__isnull=False).exists()

        # Validate based on the current payout type
        if country is None:  # Worldwide payout
            if has_countries:
                raise serializers.ValidationError(
                    "Cannot add worldwide payout when country-specific payouts exist"
                )
            if has_worldwide:
                raise serializers.ValidationError(
                    "A worldwide payout already exists for this campaign"
                )
        else:  # Country-specific payout
            if has_worldwide:
                raise serializers.ValidationError(
                    "Cannot add country-specific payout when worldwide payout exists"
                )
            # Check for duplicate country
            if payouts.filter(country=country).exists():
                raise serializers.ValidationError(
                    f"A payout for {country.name} already exists in this campaign"
                )

        return attrs


class CampaignSerializer(serializers.ModelSerializer):
    """
    Serializer for Campaign model with nested payout creation.

    Handles full CRUD operations for campaigns including
    creation and updates with associated payouts.
    """

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

    def validate_title(self, title: str) -> str:
        """
        Validate campaign title uniqueness per account.

        Args:
            title: Campaign title to validate

        Returns:
            Validated title

        Raises:
            ValidationError: If title already exists for the account
        """
        # Skip validation during campaign update if title unchanged
        if self.instance and self.instance.title == title:
            return title

        # Check if a campaign with this title already exists for the user
        user = self.context["request"].user
        if Campaign.objects.filter(account=user, title=title).exists():
            raise serializers.ValidationError(
                "A campaign with this title already exists"
            )
        return title

    def validate_payouts(self, payouts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Validate payouts data structure and business rules.

        Args:
            payouts: List of payout data dictionaries

        Returns:
            Validated payouts data

        Raises:
            ValidationError: If payouts data is invalid
        """
        if not payouts or not isinstance(payouts, list):
            error_msg = "At least one payout is required"
            raise serializers.ValidationError(error_msg)

        # Validate each payout structure
        for i, payout in enumerate(payouts):
            if not isinstance(payout, dict):
                raise serializers.ValidationError(f"Payout {i+1} must be an object")

            required_fields = ["amount", "currency"]
            for field in required_fields:
                if field not in payout:
                    raise serializers.ValidationError(
                        f"Payout {i+1} must include {field}"
                    )

            if not isinstance(payout["amount"], (int, float)):
                raise serializers.ValidationError(
                    f"Payout {i+1} amount must be a number"
                )

            if not isinstance(payout["currency"], str):
                raise serializers.ValidationError(
                    f"Payout {i+1} currency must be a string"
                )

        # Check for mixing worldwide and country-specific payouts
        has_worldwide = any(payout.get("country") is None for payout in payouts)
        has_countries = any(payout.get("country") is not None for payout in payouts)
        if has_worldwide and has_countries:
            raise serializers.ValidationError(
                "Cannot mix worldwide and country-specific payouts"
            )

        # Check for duplicate country payouts
        country_payouts = [
            payout.get("country") for payout in payouts if payout.get("country")
        ]
        if len(country_payouts) != len(set(country_payouts)):
            raise serializers.ValidationError(
                "Duplicate country payouts are not allowed"
            )

        return payouts

    def create(self, validated_data: Dict[str, Any]) -> Campaign:
        """
        Create campaign with associated payouts.

        Args:
            validated_data: Validated campaign and payouts data

        Returns:
            Created Campaign instance
        """
        payouts_data = validated_data.pop("payouts", [])

        with transaction.atomic():
            campaign = Campaign.objects.create(**validated_data)

            # Create payouts in batch for better performance
            payout_instances = []
            for payout_data in payouts_data:
                payout_data["campaign"] = campaign.id
                serializer = CampaignPayoutSerializer(data=payout_data)
                serializer.is_valid(raise_exception=True)
                payout_instances.append(CampaignPayout(**serializer.validated_data))

            # Bulk create for better performance
            if payout_instances:
                CampaignPayout.objects.bulk_create(payout_instances)

            return campaign

    def update(self, instance: Campaign, validated_data: Dict[str, Any]) -> Campaign:
        """
        Update campaign and replace all payouts.

        Args:
            instance: Campaign instance to update
            validated_data: Validated update data

        Returns:
            Updated Campaign instance
        """
        payouts_data = validated_data.pop("payouts", [])

        with transaction.atomic():
            # Update campaign fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if payouts_data:
                # Delete existing payouts
                instance.payouts.all().delete()

                # Create new payouts
                payout_instances = []
                for payout_data in payouts_data:
                    payout_data["campaign"] = instance.id
                    serializer = CampaignPayoutSerializer(data=payout_data)
                    serializer.is_valid(raise_exception=True)
                    payout_instances.append(CampaignPayout(**serializer.validated_data))

                # Bulk create for better performance
                if payout_instances:
                    CampaignPayout.objects.bulk_create(payout_instances)

        return instance

    def to_representation(self, instance: Campaign) -> Dict[str, Any]:
        """
        Include optimized payouts in the response.

        Args:
            instance: Campaign instance

        Returns:
            Serialized campaign data with payouts
        """
        data = super().to_representation(instance)
        data["payouts"] = CampaignPayoutSerializer(
            instance.payouts.all(), many=True
        ).data
        return data


class CampaignListSerializer(serializers.ModelSerializer):
    """
    Optimized serializer for campaign list view.

    Includes minimal campaign data with prefetched payouts
    for efficient list rendering.
    """

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
