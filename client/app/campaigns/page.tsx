"use client";

import CampaignCreateForm from "@/components/CampaignCreateForm";
import { Campaign } from "@/lib/api/campaigns";
import { createCampaign } from "@/lib/api/campaigns";
import DashboardLayout from "@/components/DashboardLayout";

const handleCreateCampaign = async (campaign: Partial<Campaign>) => {
    console.log(campaign);
    await createCampaign(campaign);
  }

export default function Campaigns() {
  return (
    <DashboardLayout title="Create Campaign">
      <div className="max-w-2xl">
        <CampaignCreateForm onSubmit={handleCreateCampaign} />
      </div>
    </DashboardLayout>
  );
}