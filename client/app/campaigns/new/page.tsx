"use client";

import { useRouter } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";
import { Campaign } from "@/types/campaign";
import { createCampaign } from "@/lib/api/campaigns";
import DashboardLayout from "@/components/DashboardLayout";

export default function NewCampaign() {
  const router = useRouter();

  const handleCreateCampaign = async (campaign: Partial<Campaign>) => {
    try {
      await createCampaign(campaign);
      router.push('/'); // Redirect to dashboard after successful creation
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  return (
    <DashboardLayout title="New Campaign">
      <div className="h-full w-full">
        <CampaignForm onSubmit={handleCreateCampaign} />
      </div>
    </DashboardLayout>
  );
}