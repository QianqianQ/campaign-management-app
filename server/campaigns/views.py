from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, viewsets
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated

from .filters import CampaignFilter
from .models import Campaign, CampaignPayout
from .serializers import (
    CampaignListSerializer,
    CampaignPayoutSerializer,
    CampaignSerializer,
)


class CampaignViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CampaignFilter
    lookup_field = "pk"

    ordering_fields = [
        "title",
        "landing_page_url",
        "is_running",
        "created_at",
        "updated_at",
    ]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Campaign.objects
            .filter(account=self.request.user)
            .prefetch_related("payouts")
        )

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CampaignSerializer
        return CampaignListSerializer

    def perform_create(self, serializer):
        serializer.save(account=self.request.user)


class CampaignPayoutViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignPayoutSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        queryset = CampaignPayout.objects.filter(
            campaign__account=self.request.user
        ).select_related("campaign")

        campaign_id = self.request.query_params.get("campaign")
        if campaign_id:
            try:
                campaign_id = int(campaign_id)
                queryset = queryset.filter(campaign=campaign_id)
            except ValueError:
                raise serializers.ValidationError("Invalid campaign ID")

        return queryset
