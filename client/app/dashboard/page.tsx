"use client"

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CampaignList from "@/components/CampaignList";
import CampaignSearch from "@/components/CampaignSearch";
import { Campaign, CampaignSearchFilters } from "@/lib/api/campaigns";
import CampaignCreateForm from "@/components/CampaignCreateForm";
import { useCampaigns } from "@/hooks/useCampaigns";
import AuthGuard from "@/components/AuthGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/DashboardHeader";

export default function Dashboard() {
  const [searchFilters, setSearchFilters] = useState<CampaignSearchFilters>({});
  const { createCampaign } = useCampaigns();

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
    <AuthGuard>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main>
            <CampaignSearch onSearch={handleSearch} onClear={handleClearSearch} />
            <CampaignList searchFilters={searchFilters} />
            <CampaignCreateForm onSubmit={handleCreateCampaign} />
          </main>
        </SidebarInset>
      </SidebarProvider>
      {/* <div className="container mx-auto p-4">
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
      </div> */}
    </AuthGuard>
  );
}
