from django_filters import rest_framework as filters
from .models import Campaign
from django.db.models import Q


class CampaignFilter(filters.FilterSet):
    """Filters for title, landing_page_url, and is_running"""

    # Filter for title (case-insensitive contains)
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    # Filter for landing_page_url (case-insensitive contains)
    landing_page_url = filters.CharFilter(field_name='landing_page_url',
                                          lookup_expr='icontains')
    # Filter for is_running (boolean)
    is_running = filters.BooleanFilter(field_name='is_running')
    # Global search filter
    search = filters.CharFilter(method='filter_search')

    def filter_search(self, queryset, name, value):
        """Global search filter for title and landing_page_url"""
        if value:
            return queryset.filter(
                Q(title__icontains=value) |
                Q(landing_page_url__icontains=value)
            )
        return queryset

    class Meta:
        model = Campaign
        fields = ['title', 'landing_page_url', 'is_running']
