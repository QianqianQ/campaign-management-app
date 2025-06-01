import apiClient from "./client";
import { Campaign, CampaignSearchFilters } from "@/types/campaign";
import { logger } from "@/lib/utils";

/**
 * Create a new campaign
 * @param campaign - Partial campaign data
 * @returns Promise<Campaign> - Created campaign
 */
export const createCampaign = async (campaign: Partial<Campaign>): Promise<Campaign> => {
    try {
        const response = await apiClient.post('/campaigns/', campaign);
        return response.data;
    } catch (error) {
        logger.error('Failed to create campaign:', error);
        throw error;
    }
};

/**
 * Get all campaigns with optional filters
 * @param filters - Optional search filters
 * @returns Promise<Campaign[]> - Array of campaigns
 */
export const getCampaigns = async (filters?: CampaignSearchFilters): Promise<Campaign[]> => {
    try {
        const params = new URLSearchParams();

        if (filters?.title) params.append('title', filters.title);
        if (filters?.landing_page_url) params.append('landing_page_url', filters.landing_page_url);
        if (filters?.is_running !== null && filters?.is_running !== undefined) {
            params.append('is_running', filters.is_running.toString());
        }
        if (filters?.search) params.append('search', filters.search);

        const queryString = params.toString();
        const url = queryString ? `/campaigns?${queryString}` : '/campaigns';

        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        logger.error('Failed to fetch campaigns:', error);
        throw error;
    }
};

/**
 * Search campaigns (alias for getCampaigns for backward compatibility)
 * @param filters - Optional search filters
 * @returns Promise<Campaign[]> - Array of campaigns
 */
export const searchCampaigns = async (filters?: CampaignSearchFilters): Promise<Campaign[]> => {
    return getCampaigns(filters);
};

/**
 * Get a campaign by ID
 * @param id - Campaign ID
 * @returns Promise<Campaign> - Campaign data
 */
export const getCampaignById = async (id: number): Promise<Campaign> => {
    try {
        const response = await apiClient.get(`/campaigns/${id}/`);
        return response.data;
    } catch (error) {
        logger.error(`Failed to fetch campaign ${id}:`, error);
        throw error;
    }
};

/**
 * Update a campaign (full update)
 * @param id - Campaign ID
 * @param campaign - Complete campaign data
 * @returns Promise<Campaign> - Updated campaign
 */
export const updateCampaign = async (id: number, campaign: Campaign): Promise<Campaign> => {
    try {
        const response = await apiClient.put(`/campaigns/${id}/`, campaign);
        return response.data;
    } catch (error) {
        logger.error(`Failed to update campaign ${id}:`, error);
        throw error;
    }
};

/**
 * Partially update a campaign
 * @param id - Campaign ID
 * @param campaign - Partial campaign data
 * @returns Promise<Campaign> - Updated campaign
 */
export const partialUpdateCampaign = async (id: number, campaign: Partial<Campaign>): Promise<Campaign> => {
    try {
        const response = await apiClient.patch(`/campaigns/${id}/`, campaign);
        return response.data;
    } catch (error) {
        logger.error(`Failed to partially update campaign ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a campaign
 * @param id - Campaign ID
 * @returns Promise<void>
 */
export const deleteCampaign = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/campaigns/${id}/`);
    } catch (error) {
        logger.error(`Failed to delete campaign ${id}:`, error);
        throw error;
    }
};

/**
 * Toggle campaign running status
 * @param id - Campaign ID
 * @param isRunning - New running status
 * @returns Promise<Campaign> - Updated campaign
 */
export const toggleCampaignRunning = async (id: number, isRunning: boolean): Promise<Campaign> => {
    try {
        const response = await apiClient.patch(`/campaigns/${id}/`, { is_running: isRunning });
        return response.data;
    } catch (error) {
        logger.error(`Failed to toggle campaign ${id} status:`, error);
        throw error;
    }
};
