"use client";

import CampaignCreateForm from "@/components/CampaignCreateForm";
import { Campaign } from "@/lib/api/campaigns";
import { createCampaign } from "@/lib/api/campaigns";
import DashboardLayout from "@/components/DashboardLayout";

const handleCreateCampaign = async (campaign: Partial<Campaign>) => {
    await createCampaign(campaign);
  }

export default function Campaigns() {
  return (
    <DashboardLayout title="New Campaign">
      <div className="h-full w-full">
        <CampaignCreateForm onSubmit={handleCreateCampaign} />
      </div>
    </DashboardLayout>
  );
}