"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Campaign, getCampaignById, updateCampaign } from "@/lib/api/campaigns";
import DashboardLayout from "@/components/DashboardLayout";

export default function EditCampaign() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const campaignId = searchParams.get('id');

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) {
        setError('Campaign ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get campaign data from backend
        const data = await getCampaignById(parseInt(campaignId));
        // Set campaign data in state
        setCampaign(data);
      } catch (err) {
        // Set error message if failed to load campaign
        setError('Failed to load campaign');
        console.error('Error fetching campaign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  // Handle update campaign
  const handleUpdateCampaign = async (updatedCampaign: Partial<Campaign>) => {
    if (!campaignId) return;

    try {
      // Update campaign data in backend
      await updateCampaign(parseInt(campaignId), updatedCampaign as Campaign);
      // Redirect to dashboard after successful update
      router.push('/');
    } catch (err) {
      console.error('Error updating campaign:', err);
      throw err; // Let the form handle the error
    }
  };

  // Render loading spinner while fetching campaign
  if (loading) {
    return (
      <DashboardLayout title="Edit Campaign">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  // Render error message if error or campaign is not found
  if (error || !campaign) {
    return (
      <DashboardLayout title="Edit Campaign">
        <div className="text-center py-8">
          <p className="text-red-500">{error || 'Campaign not found'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Campaign">
      <div className="h-full w-full">
        <CampaignForm
          onSubmit={handleUpdateCampaign}
          initialData={campaign}
          isEditMode={true}
        />
      </div>
    </DashboardLayout>
  );
}