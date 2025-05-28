"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import CampaignList from "@/components/CampaignList";
import CampaignSearch from "@/components/CampaignSearch";
import { Campaign, CampaignSearchFilters } from "@/lib/api/campaigns";
import CampaignCreateForm from "@/components/CampaignCreateForm";
import { useCampaigns } from "@/hooks/useCampaigns";

export default function Dashboard() {
  const { signout, user, isAuthenticated, loading } = useAuth();
  const [searchFilters, setSearchFilters] = useState<CampaignSearchFilters>({});
  const { createCampaign } = useCampaigns();
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard: isAuthenticated:', isAuthenticated, 'loading:', loading);
    if (!loading && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, loading, router]);

  // Show nothing while loading to prevent flash
  if (loading || !isAuthenticated) {
    return null;
  }

  const handleSearch = (filters: CampaignSearchFilters) => {
    setSearchFilters(filters);
  }

  const handleClearSearch = () => {
    setSearchFilters({});
  }

  const handleCreateCampaign = async (campaign: Partial<Campaign>) => {
    console.log(campaign);
    await createCampaign(campaign);
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Welcome to Campaign Management Portal</CardTitle>
          <Button variant="outline" onClick={signout}>
            Sign Out
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Logged in as: {user?.email || "Unknown"}</p>
        </CardContent>
      </Card>
      <CampaignSearch onSearch={handleSearch} onClear={handleClearSearch} />
      <CampaignList searchFilters={searchFilters} />
      <CampaignCreateForm onSubmit={handleCreateCampaign} />
    </div>
  );
}
