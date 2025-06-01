"use client";

import { useEffect, useState, useMemo, memo, useCallback } from "react";
import Link from "next/link";
import { Filter, MoreHorizontal, Plus, Search, SlidersHorizontal, RefreshCw, Trash2, Edit, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useRouter } from "next/navigation";
import { Campaign } from "@/types/campaign";

import { useCampaigns } from "@/hooks/useCampaigns";
// import { CampaignSearchFilters } from "@/lib/api/campaigns";

// interface campaignListProps {
//   searchFilters: CampaignSearchFilters;
// }

// Currency symbols
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
}

/**
 * Memoized campaign row component
 */
const CampaignRow = memo(function CampaignRow({
  campaign,
  onToggleRunning,
  onDeleteClick,
  onEdit,
}: {
  campaign: Campaign;
  onToggleRunning: (id: number, isRunning: boolean) => void;
  onDeleteClick: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const formatDate = useCallback((date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const formatCountry = useCallback((country: string | null) => {
    const countryCode = country ? country.match(/\(([A-Z]{2})\)/)?.[1] : 'Worldwide';
    return countryCode ? countryCode : 'Worldwide';
  }, []);

  const formatUrl = useCallback((url: string) => {
    return url.length > 40 ? url.substring(0, 37) + "..." : url;
  }, []);

  return (
    <TableRow>
      <TableCell className="font-medium">{campaign.title}</TableCell>
      <TableCell>
        <a
          href={campaign.landing_page_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          title={`${campaign.landing_page_url}`}
        >
          {formatUrl(campaign.landing_page_url)}
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(campaign.landing_page_url)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Copy landing page URL"
          title={`${campaign.landing_page_url}`}
        >
          <Copy className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {campaign.payouts.length > 0 ? (
            campaign.payouts.map((payout, index) => (
              <Badge key={payout.id || index} variant="secondary" className="text-xs">
                {formatCountry(payout.country)} - {currencySymbols[payout.currency] || payout.currency}{payout.amount}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-xs">No payouts</Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Badge variant={campaign.is_running ? "default" : "secondary"}>
            {campaign.is_running ? "Running" : "Stopped"}
          </Badge>
          <Switch
            checked={campaign.is_running}
            onCheckedChange={(checked) => onToggleRunning(campaign.id, checked)}
          />
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(campaign.created_at)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(campaign.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteClick(campaign.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
});

function CampaignsList() {
  const router = useRouter();
  const {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    handleToggleCampaignRunning,
    deleteCampaign,
  } = useCampaigns();
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<{ id: number } | null>(null)

  useEffect(() => {
    // Fetch all campaigns without filters for frontend filtering
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Memoized filtered and sorted campaigns for better performance
  const processedCampaigns = useMemo(() => {
    // Filter campaigns based on search and status
    const filteredCampaigns = campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.landing_page_url.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "running" && campaign.is_running) ||
        (statusFilter === "stopped" && !campaign.is_running)

      return matchesSearch && matchesStatus;
    })

    // Sort campaigns
    return [...filteredCampaigns].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        default:
          return 0
      }
    })
  }, [campaigns, searchQuery, statusFilter, sortBy]);

  // Handle delete campaign
  const handleDeleteClick = useCallback((campaignId: number) => {
    setCampaignToDelete({ id: campaignId });
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (campaignToDelete) {
      try {
        await deleteCampaign(campaignToDelete.id);
        await fetchCampaigns(); // Refresh the list
        setDeleteDialogOpen(false);
        setCampaignToDelete(null);
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  }, [campaignToDelete, deleteCampaign, fetchCampaigns]);

  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setCampaignToDelete(null);
    }
  }, []);

  const handleEdit = useCallback((campaignId: number) => {
    router.push(`/campaigns/edit?id=${campaignId}`);
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="shadow-lg">
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
            <span className="text-muted-foreground">Loading campaigns...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="shadow-lg border-red-200">
          <CardContent className="py-8 text-center">
            <div className="text-red-500 font-medium">Error loading campaigns</div>
            <p className="text-red-400 text-sm mt-1">{error}</p>
            <Button
              onClick={() => fetchCampaigns()}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage your advertising campaigns</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new/">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            {processedCampaigns.length} campaign{processedCampaigns.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                {/* Status filter */}
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Sort</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                  <SelectItem value="z-a">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {processedCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No campaigns found matching your criteria.</p>
              <Button asChild className="mt-4">
                <Link href="/campaigns/new/">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Link>
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Landing Page</TableHead>
                    <TableHead>Payouts</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedCampaigns.map((campaign) => (
                    <CampaignRow
                      key={campaign.id}
                      campaign={campaign}
                      onToggleRunning={handleToggleCampaignRunning}
                      onDeleteClick={handleDeleteClick}
                      onEdit={handleEdit}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirm={handleDeleteConfirm}
        title="Delete Campaign"
        description="Are you sure you want to delete the campaign? This action cannot be undone and all associated payouts will also be deleted."
      />
    </div>
  )
}

export default memo(CampaignsList);
