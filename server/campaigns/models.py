from django.db import models
from django.core.validators import URLValidator

from django_countries.fields import CountryField

from accounts.models import Account


class Campaign(models.Model):
    """Campaign model for the campaign"""
    # NOTE: Consider implementing soft deletion using is_deleted field
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="campaigns"
    )
    title = models.CharField(max_length=255, help_text="The title of the campaign")
    landing_page_url = models.URLField(
        validators=[URLValidator()], help_text="The URL of the landing page"
    )
    is_running = models.BooleanField(
        default=False, help_text="Whether the campaign is running"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, help_text="The date and time the campaign was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True, help_text="The date and time the campaign was last updated"
    )

    class Meta:
        verbose_name = "campaign"
        verbose_name_plural = "campaigns"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["account", "is_running"]),
            models.Index(fields=["title"])
        ]

    def __str__(self):
        return f"{self.title} - {getattr(self.account, 'username', 'Unknown')}"


class CampaignPayout(models.Model):
    """Campaign payout model for the campaign"""
    # TODO: Add custom validation for the country vs worldwide conflict
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name="payouts"
    )
    country = CountryField(
        blank=True,  # Allow blank for worldwide
        null=True,  # Allow null for worldwide
        help_text="Leave blank to apply this payout worldwide",
    )
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="The amount of the payout"
    )
    # TODO: Add more currencies, or connect to a currency table
    currency = models.CharField(
        max_length=3,
        choices=[("EUR", "Euro"), ("USD", "US Dollar")],
        default="EUR",
    )
    # NOTE: Consider using a status field with choices
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(
        auto_now_add=True, help_text="The date and time the payout was created"
    )
    updated_at = models.DateTimeField(
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
            # for filtering by campaign and is_active
            models.Index(fields=["campaign", "is_active"]),
        ]

    @property
    def is_worldwide(self):
        """Check if the payout is worldwide"""
        return not self.country

    @property
    def display_country(self):
        """Get the display name of the country"""
        return self.country.name if self.country else "Worldwide"

    def __str__(self):
        country_name = self.display_country
        return (
            f"{self.campaign.title} - {country_name} - "
            f"{self.amount} {self.currency}"
        )
