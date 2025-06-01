/**
 * Campaign types
 */

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

export interface CampaignSearchProps {
    onSearch: (params: CampaignSearchFilters) => void;
    onClear: () => void;
    loading?: boolean;
}

export interface CampaignCreateFormProps {
    onSubmit: (formData: Partial<Campaign>) => Promise<void>;
    initialData?: Campaign;
    isEditMode?: boolean;
}
