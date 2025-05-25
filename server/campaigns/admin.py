from django.contrib import admin
from .models import Campaign, CampaignPayout


class CampaignPayoutInline(admin.TabularInline):
    """Display the campaign payouts in the campaign admin page"""
    model = CampaignPayout
    extra = 1
    fk_name = "campaign"
    fields = ("country", "amount", "currency")
    list_per_page = 20


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("account", "title", "landing_page_url", "is_running",
                    "created_at", "updated_at")
    list_filter = ("account", "is_running")
    search_fields = ("title", "landing_page_url")
    readonly_fields = ("created_at", "updated_at")
    inlines = [CampaignPayoutInline]
    list_per_page = 20

    fieldsets = (
        ("Campaign", {
            "fields": ("account", "title", "landing_page_url")
        }),
        ("Status", {
            "fields": ("is_running",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )


@admin.register(CampaignPayout)
class CampaignPayoutAdmin(admin.ModelAdmin):
    list_display = ("campaign", "display_country", "amount", "currency")
    list_filter = ("campaign", "country")
    search_fields = ("campaign__title", "country__name")
    list_per_page = 20
