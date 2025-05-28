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
            <div key={campaign.id} className="border p-4 mb-4 rounded-lg">
              <h3 className="text-lg font-semibold">{campaign.title}</h3>
              <p>Status: {campaign.is_running ? 'Running' : 'Stopped'}</p>
              <p>Landing Page:
                <a href={campaign.landing_page_url} target="_blank" className="text-blue-600 hover:underline ml-1">
                  {campaign.landing_page_url}
                </a>
              </p>

              {/* Payouts Section */}
              <div className="mt-3">
                <h4 className="font-medium mb-2">Payouts:</h4>
                {campaign.payouts && campaign.payouts.length > 0 ? (
                  <div className="space-y-2">
                    {campaign.payouts.map((payout) => (
                      <div key={payout.id} className="bg-gray-100 p-2 rounded text-sm">
                        <span className="font-medium">
                          {payout.country || 'Worldwide'}:
                        </span>
                        <span className="ml-2">
                          {payout.amount} {payout.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No payouts set</p>
                )}
              </div>

              <button
                onClick={() => handleToggleCampaignRunning(campaign.id, !campaign.is_running)}
                className={`mt-3 px-4 py-2 text-white rounded ${
                  campaign.is_running
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {campaign.is_running ? 'Running - Click to Pause' : 'Paused - Click to Start'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
