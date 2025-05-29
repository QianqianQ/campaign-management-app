// hooks/useCampaigns.ts - Minor updates for better error handling
import { useState, useCallback } from 'react';
import {
  Campaign,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  partialUpdateCampaign,
  toggleCampaignRunning,
  CampaignSearchFilters
} from '@/lib/api/campaigns';
import { AxiosError } from 'axios';

interface ErrorResponse {
  detail?: string;
  message?: string;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns with optional filters
  const fetchCampaigns = useCallback(async (filters?: CampaignSearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCampaigns(filters);
      setCampaigns(data);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.detail ||
                          axiosError.response?.data?.message ||
                          'Failed to fetch campaigns';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle running status
  const handleToggleCampaignRunning = async (id: number, isRunning: boolean) => {
    try {
      const data = await toggleCampaignRunning(id, isRunning);
      setCampaigns(prev => prev.map(campaign =>
        campaign.id === id
          ? { ...campaign, ...data } // Merge response with existing campaign data
          : campaign
      ));
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.detail ||
                          axiosError.response?.data?.message ||
                          'Failed to update campaign status';
      setError(errorMessage);
    }
  }


  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    partialUpdateCampaign,
    handleToggleCampaignRunning
  };
}
