"use client"

import { useState } from "react";
import CampaignList from "@/components/CampaignList";
// import CampaignSearch from "@/components/CampaignSearch";
import { CampaignSearchFilters } from "@/lib/api/campaigns";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  // const [searchFilters, setSearchFilters] = useState<CampaignSearchFilters>({});

  // const handleSearch = (filters: CampaignSearchFilters) => {
  //   setSearchFilters(filters);
  // }

  // const handleClearSearch = () => {
  //   setSearchFilters({});
  // }

  return (
    <DashboardLayout>
      {/* <CampaignSearch onSearch={handleSearch} onClear={handleClearSearch} /> */}

      <div className="grid gap-6">
        <CampaignList />
      </div>
    </DashboardLayout>
  );
}