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
