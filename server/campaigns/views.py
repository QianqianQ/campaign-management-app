from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Campaign, CampaignPayout
from .serializers import (
    CampaignListSerializer,
    CampaignPayoutSerializer,
    CampaignSerializer,
)


class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CampaignSerializer
        return CampaignListSerializer

    def get_queryset(self):
        queryset = Campaign.objects.filter(account=self.request.user).prefetch_related(
            "payouts"
        )

        is_running = self.request.query_params.get("is_running")
        if is_running is not None:
            is_running = is_running.lower() == "true"
            queryset = queryset.filter(is_running=is_running)

        return queryset

    def perform_create(self, serializer):
        serializer.save(account=self.request.user)

    def perform_destroy(self, instance):
        # NOTE: Possible to add custom logic to handle the deletion of the campaign
        return super().perform_destroy(instance)

    def partial_update(self, request, *args, **kwargs):
        # NOTE: Possible to add custom logic to handle the partial update
        return super().partial_update(request, *args, **kwargs)


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
