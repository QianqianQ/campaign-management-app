import apiClient from "./client";


export interface Campaign {
  id: number;
  title: string;
  landing_page_url: string;
  is_running: boolean;
  payouts: CampaignPayout[];
  created_at: Date;
  updated_at: Date;
}

export interface CampaignPayout {
    id?: number;
    campaign_id: number;
    country: string | null; // null for worldwide
    amount: number;
    currency: string;
    created_at: Date;
    updated_at: Date;
}

export interface CampaignSearchFilters {
    title?: string;
    landing_page_url?: string;
    is_running?: boolean;
    search?: string;
}

// Create a campaign
export const createCampaign = async (campaign: Campaign): Promise<Campaign> => {
    const response = await apiClient.post('/campaigns', campaign);
    return response.data;
}

// Get all campaigns with possible filters
export const getCampaigns = async (filters?: CampaignSearchFilters): Promise<Campaign[]> => {
    const params = new URLSearchParams();

    if (filters?.title) params.append('title', filters.title);
    if (filters?.landing_page_url) params.append('landing_page_url', filters.landing_page_url);
    if (filters?.is_running !== null && filters?.is_running !== undefined) params.append('is_running',
        filters.is_running.toString());
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/campaigns?${queryString}` : '/campaigns';
    const response = await apiClient.get(url);
    return response.data;
}

export const searchCampaigns = async (filters?: CampaignSearchFilters): Promise<Campaign[]> => {
    const params = new URLSearchParams();

    if (filters?.title) params.append('title', filters.title);
    if (filters?.landing_page_url) params.append('landing_page_url', filters.landing_page_url);
    if (filters?.is_running !== null && filters?.is_running !== undefined) params.append('is_running',
        filters.is_running.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get(`/campaigns?${params.toString()}`);
    return response.data;
}

// Get a campaign by id
export const getCampaignById = async (id: number): Promise<Campaign> => {
    const response = await apiClient.get(`/campaigns/${id}`);
    return response.data;
}

// Update a campaign
export const updateCampaign = async (id: number, campaign: Campaign): Promise<Campaign> => {
    const response = await apiClient.put(`/campaigns/${id}`, campaign);
    return response.data;
}

// Partial update a campaign
export const partialUpdateCampaign = async (id: number, campaign: Partial<Campaign>): Promise<Campaign> => {
    const response = await apiClient.patch(`/campaigns/${id}`, campaign);
    return response.data;
}

// Delete a campaign
export const deleteCampaign = async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/campaigns/${id}`);
    return response.data;
}


// Toggile is_running status
export const toggleCampaignRunning = async (id: number, isRunning: boolean): Promise<Campaign> => {
    const response = await apiClient.patch(`/campaigns/${id}/`, { is_running: isRunning });
    return response.data;
}
