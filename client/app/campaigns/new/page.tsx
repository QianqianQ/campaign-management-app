"use client";

import { useRouter } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";
import { Campaign } from "@/lib/api/campaigns";
import { createCampaign } from "@/lib/api/campaigns";
import DashboardLayout from "@/components/DashboardLayout";

export default function Campaigns() {
  const router = useRouter();

const handleCreateCampaign = async (campaign: Partial<Campaign>) => {
    await createCampaign(campaign);
    router.push('/'); // Redirect to dashboard after successful creation
  };

  return (
    <DashboardLayout title="New Campaign">
      <div className="h-full w-full">
        <CampaignForm onSubmit={handleCreateCampaign} />
      </div>
    </DashboardLayout>
  );
}