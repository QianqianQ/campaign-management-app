import apiClient from "./client";


export interface Campaign {
  id: number;
  title: string;
  landing_page_url: string;
  is_running: boolean;
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

// Create a campaign
export const createCampaign = async (campaign: Campaign): Promise<Campaign> => {
    const response = await apiClient.post('/campaigns', campaign);
    return response.data;
}

// Get all campaigns
export const getCampaigns = async (): Promise<Campaign[]> => {
    const response = await apiClient.get('/campaigns');
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
