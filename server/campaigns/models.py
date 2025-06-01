"""
Campaign management models.

This module contains the models for campaign management including
Campaign and CampaignPayout models with their business logic.
"""

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.db import models
from django_countries.fields import CountryField

from accounts.models import Account


class Campaign(models.Model):
    """
    Campaign model representing a marketing campaign.

    A campaign belongs to an account and can have multiple payouts
    for different countries or worldwide.

    Attributes:
        account: The account that owns this campaign
        title: The title/name of the campaign
        landing_page_url: The URL where users will be directed
        is_running: Whether the campaign is currently active
        created_at: When the campaign was created
        updated_at: When the campaign was last modified
    """

    account: models.ForeignKey[Account] = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="campaigns",
        help_text="The account that owns this campaign",
    )
    title: models.CharField = models.CharField(
        max_length=255, help_text="The title of the campaign"
    )
    landing_page_url: models.URLField = models.URLField(
        validators=[URLValidator()], help_text="The URL of the landing page"
    )
    is_running: models.BooleanField = models.BooleanField(
        default=False, help_text="Whether the campaign is running"
    )
    created_at: models.DateTimeField = models.DateTimeField(
        auto_now_add=True, help_text="The date and time the campaign was created"
    )
    updated_at: models.DateTimeField = models.DateTimeField(
        auto_now=True, help_text="The date and time the campaign was last updated"
    )

    class Meta:
        verbose_name = "campaign"
        verbose_name_plural = "campaigns"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["account", "is_running"]),
            models.Index(fields=["account", "title"]),
        ]

    def __str__(self) -> str:
        """Return string representation of the campaign."""
        account_name = getattr(self.account, "username", "Unknown")
        return f"{self.title} - {account_name}"


class CampaignPayout(models.Model):
    """
    Campaign payout model representing payment amounts for campaigns.

    A payout can be country-specific or worldwide. Each campaign can have
    either multiple country-specific payouts OR one worldwide payout, but not both.

    Attributes:
        campaign: The campaign this payout belongs to
        country: Specific country (None for worldwide)
        amount: Payment amount
        currency: Currency code (EUR, USD)
        is_active: Whether this payout is currently active
        created_at: When the payout was created
        updated_at: When the payout was last modified
    """

    campaign: models.ForeignKey[Campaign] = models.ForeignKey(
        Campaign,
        on_delete=models.CASCADE,
        related_name="payouts",
        help_text="The campaign this payout belongs to",
    )
    country = CountryField(
        blank=True,
        null=True,
        help_text="Leave blank to apply this payout worldwide",
    )
    amount: models.DecimalField = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="The amount of the payout"
    )
    currency: models.CharField = models.CharField(
        max_length=3,
        choices=[("EUR", "Euro"), ("USD", "US Dollar")],
        default="EUR",
        help_text="The currency of the payout amount",
    )
    is_active: models.BooleanField = models.BooleanField(
        default=True, help_text="Whether this payout is currently active"
    )
    created_at: models.DateTimeField = models.DateTimeField(
        auto_now_add=True, help_text="The date and time the payout was created"
    )
    updated_at: models.DateTimeField = models.DateTimeField(
        auto_now=True, help_text="The date and time the payout was last updated"
    )

    class Meta:
        verbose_name = "campaign_payout"
        verbose_name_plural = "campaign_payouts"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["campaign", "country"],
                condition=models.Q(country__isnull=False),
                name="unique_campaign_country_payout",
            ),
            models.UniqueConstraint(
                fields=["campaign"],
                condition=models.Q(country__isnull=True),
                name="unique_campaign_worldwide_payout",
            ),
        ]
        indexes = [
            models.Index(fields=["campaign", "country"]),
        ]

    @property
    def is_worldwide(self) -> bool:
        """Check if the payout is worldwide."""
        return not self.country

    @property
    def display_country(self) -> str:
        """Get the display name of the country."""
        return self.country.name if self.country else "Worldwide"

    def __str__(self) -> str:
        """Return string representation of the payout."""
        country_name = self.display_country
        return (
            f"{self.campaign.title} - {country_name} - "
            f"{self.amount} {self.currency}"
        )

    def clean(self) -> None:
        """
        Validate the payout instance.

        Ensures business rules are followed regarding worldwide vs
        country-specific payouts.
        """

        super().clean()

        if self.campaign_id:  # Only validate if campaign is set
            # Check for conflicting payout types
            existing_payouts = CampaignPayout.objects.filter(
                campaign=self.campaign, is_active=True
            )

            if self.pk:  # Exclude current instance if updating
                existing_payouts = existing_payouts.exclude(pk=self.pk)

            has_worldwide = existing_payouts.filter(country__isnull=True).exists()
            has_countries = existing_payouts.filter(country__isnull=False).exists()

            if self.country is None:  # This is a worldwide payout
                if has_countries:
                    raise ValidationError(
                        "Cannot add worldwide payout when "
                        "country-specific payouts exist"
                    )
            else:  # This is a country-specific payout
                if has_worldwide:
                    raise ValidationError(
                        "Cannot add country-specific payout when "
                        "worldwide payout exists"
                    )

    def save(self, *args, **kwargs) -> None:
        """Save the payout instance with validation."""
        self.clean()
        super().save(*args, **kwargs)
