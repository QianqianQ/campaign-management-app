'use client';

import { useEffect } from 'react';

import { useCampaigns } from '@/hooks/useCampaigns';
import { CampaignSearchFilters } from '@/lib/api/campaigns';


interface campaignListProps {
  searchFilters: CampaignSearchFilters;
}

export default function CampaignList({ searchFilters = {} }: campaignListProps) {
  const {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    handleToggleCampaignRunning,
  } = useCampaigns();

  useEffect(() => {
    fetchCampaigns(searchFilters);
  }, [searchFilters, fetchCampaigns]);

  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <div className="error">Error: {error}</div>;


  return (
    <div>
      <div>
        <h2>Campaigns</h2>
        <button onClick={() => fetchCampaigns(searchFilters)}>Refresh</button>
      </div>

      {campaigns.length === 0 ? (
        <p>No campaigns found</p>
      ) : (
        <div>
          {campaigns.map((campaign) => (
            <div key={campaign.id}>
              <h3>{campaign.title}</h3>
              <p>Status: {campaign.is_running ? 'Running' : 'Stopped'}</p>
              <a href={campaign.landing_page_url} target="_blank">
                View Landing Page
              </a>
              <button
                onClick={() => handleToggleCampaignRunning(campaign.id, !campaign.is_running)}
                style={{ cursor: 'pointer' }}
              >
                {campaign.is_running ? 'Stop' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
