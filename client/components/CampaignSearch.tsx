'use client';

import { useState } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignSearchFilters } from '@/lib/api/campaigns';

interface CampaignSearchProps {
  onSearch: (params: CampaignSearchFilters) => void;
  onClear: () => void;
  loading?: boolean;
}

export default function CampaignSearch({ onSearch, loading }: CampaignSearchProps) {
  const [searchForm, setSearchForm] = useState<CampaignSearchFilters>({
    title: '',
    landing_page_url: '',
    is_running: undefined,
    search: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty values
    const filters: CampaignSearchFilters = {};
    if (searchForm.title?.trim()) filters.title = searchForm.title.trim();
    if (searchForm.landing_page_url?.trim()) filters.landing_page_url = searchForm.landing_page_url.trim();
    if (searchForm.is_running !== null) filters.is_running = searchForm.is_running;
    if (searchForm.search?.trim()) filters.search = searchForm.search.trim();

    onSearch(filters);
  };

  // const handleClear = () => {
  //   setSearchForm({
  //     title: '',
  //     landing_page_url: '',
  //     is_running: undefined,
  //     search: ''
  //   });
  //   onClear();
  // };

  const handleChange = (field: keyof CampaignSearchFilters, value: string | boolean | null) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Row */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Global Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              value={searchForm.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="Search campaigns by title or URL..."
              className="pl-10 pr-4 py-2.5 text-base"
            />
          </div>

          {/* Title Filter */}
          <div className="w-full lg:w-64">
            <Input
              type="text"
              value={searchForm.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Filter by title..."
              className="py-2.5"
            />
          </div>

          {/* URL Filter */}
          <div className="w-full lg:w-64">
            <Input
              type="text"
              value={searchForm.landing_page_url || ''}
              onChange={(e) => handleChange('landing_page_url', e.target.value)}
              placeholder="Filter by URL..."
              className="py-2.5"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-40">
            <Select
              value={searchForm.is_running === null || searchForm.is_running === undefined ? 'all' : searchForm.is_running.toString()}
              onValueChange={(value) => {
                handleChange('is_running', value === 'all' ? null : value === 'true');
              }}
            >
              <SelectTrigger className="py-2.5">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Running</SelectItem>
                <SelectItem value="false">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
