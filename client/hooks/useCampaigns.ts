// hooks/useCampaigns.ts - Minor updates for better error handling
import { useState, useCallback } from 'react';
import { Campaign, CampaignSearchFilters } from '@/types/campaign';
import {
  getCampaigns,
  createCampaign as apiCreateCampaign,
  updateCampaign as apiUpdateCampaign,
  deleteCampaign as apiDeleteCampaign,
  partialUpdateCampaign,
  toggleCampaignRunning,
} from '@/lib/api/campaigns';
import { AxiosError } from 'axios';

interface ErrorResponse {
  detail?: string;
  message?: string;
}

/**
 * Custom hook for managing campaigns state and operations
 */
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch campaigns with optional filters
   */
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

  /**
   * Toggle campaign running status
   */
  const handleToggleCampaignRunning = useCallback(async (id: number, isRunning: boolean) => {
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
  }, []);

  /**
   * Create a new campaign
   */
  const createCampaign = useCallback(async (campaign: Partial<Campaign>) => {
    try {
      const newCampaign = await apiCreateCampaign(campaign);
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (err) {
      console.error('Error creating campaign:', err);
      throw err;
    }
  }, []);

  /**
   * Update an existing campaign
   */
  const updateCampaign = useCallback(async (id: number, campaign: Campaign) => {
    try {
      const updatedCampaign = await apiUpdateCampaign(id, campaign);
      setCampaigns(prev => prev.map(c => c.id === id ? updatedCampaign : c));
      return updatedCampaign;
    } catch (err) {
      console.error(`Error updating campaign ${id}:`, err);
      throw err;
    }
  }, []);

  /**
   * Delete a campaign
   */
  const deleteCampaign = useCallback(async (id: number) => {
    try {
      await apiDeleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(`Error deleting campaign ${id}:`, err);
      throw err;
    }
  }, []);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    partialUpdateCampaign,
    handleToggleCampaignRunning,
  };
}
