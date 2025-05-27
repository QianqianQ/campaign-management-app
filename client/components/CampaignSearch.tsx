'use client';

import { useState } from 'react';
import { CampaignSearchFilters } from '@/lib/api/campaigns';

interface CampaignSearchProps {
  onSearch: (params: CampaignSearchFilters) => void;
  onClear: () => void;
  loading?: boolean;
}

export default function CampaignSearch({ onSearch, onClear, loading }: CampaignSearchProps) {
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

  const handleClear = () => {
    setSearchForm({
      title: '',
      landing_page_url: '',
      is_running: undefined,
      search: ''
    });
    onClear();
  };

  const handleChange = (field: keyof CampaignSearchFilters, value: any) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="campaign-search bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Search Campaigns</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Global Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-1">
            Global Search
          </label>
          <input
            type="text"
            id="search"
            value={searchForm.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search across title and landing page URL..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will search both title and landing page URL fields
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-md font-medium mb-3">Specific Field Filters</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                id="title"
                value={searchForm.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Search by title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="landing_page_url" className="block text-sm font-medium mb-1">
                Landing Page URL
              </label>
              <input
                type="text"
                id="landing_page_url"
                value={searchForm.landing_page_url || ''}
                onChange={(e) => handleChange('landing_page_url', e.target.value)}
                placeholder="Search by URL..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="is_running" className="block text-sm font-medium mb-1">
                Running Status
              </label>
              <select
                id="is_running"
                value={searchForm.is_running === null || searchForm.is_running === undefined ? '' : searchForm.is_running.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange('is_running', value === '' ? null : value === 'true');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="true">Running</option>
                <option value="false">Stopped</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
