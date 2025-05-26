// hooks/useCampaigns.ts - Minor updates for better error handling
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Campaign,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  partialUpdateCampaign
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
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCampaigns();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCampaigns();
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
  };

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    partialUpdateCampaign
  };
}
