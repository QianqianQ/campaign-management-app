"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter, MoreHorizontal, Plus, Search, SlidersHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useRouter } from "next/navigation";

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

export default function CampaignsList() {
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

  // Handle delete campaign
  const handleDeleteClick = (campaignId: number) => {
    setCampaignToDelete({ id: campaignId });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (campaignToDelete) {
      try {
        await deleteCampaign(campaignToDelete.id);
        // await fetchCampaigns(searchFilters);
        await fetchCampaigns(); // Refresh the list
        setDeleteDialogOpen(false);
        setCampaignToDelete(null);
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setCampaignToDelete(null);
    }
  };

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
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
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

  // Format date for display
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format country
  const formatCountry = (country: string | null) => {
    const countryCode = country ? country.match(/\(([A-Z]{2})\)/)?.[1] : 'Worldwide';
    return countryCode ? countryCode : 'Worldwide';
  }

  // Format displayed URL with ellipsis when too long
  const formatUrl = (url: string) => {
    return url.length > 40 ? url.substring(0, 37) + "..." : url;
  }


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
            {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? "s" : ""} found
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center gap-1">
                      Campaign
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payouts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCampaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No campaigns found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{campaign.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1 overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 text-muted-foreground hover:text-foreground flex-shrink-0"
                              onClick={() => {
                                navigator.clipboard.writeText(campaign.landing_page_url)
                              }}
                              title={`${campaign.landing_page_url}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </Button>
                            <div className="relative flex-1 min-w-0">
                              <div
                                className="truncate max-w-[240px] hover:bg-gray-50 rounded px-1 py-0.5 relative group"
                                title={campaign.landing_page_url}
                              >
                                {formatUrl(campaign.landing_page_url)}
                                <div className="absolute left-0 top-full mt-2 z-[9999] bg-gray-900 text-white px-3 py-2 rounded-md shadow-xl text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none whitespace-nowrap min-w-max">
                                  {campaign.landing_page_url}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={campaign.is_running}
                            onCheckedChange={() => handleToggleCampaignRunning(campaign.id, !campaign.is_running)}
                          />
                          <Badge variant={campaign.is_running ? "default" : "secondary"}>
                            {campaign.is_running ? "Running" : "Stopped"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(campaign.payouts || []).slice(0, 2).map((payout, i) => (
                            <Badge key={i} variant="outline" className="flex items-center gap-1">
                              <span>{formatCountry(payout.country)}</span>
                              <span>
                                {currencySymbols[payout.currency] || ""}
                                {payout.amount}
                              </span>
                            </Badge>
                          ))}
                          {(campaign.payouts || []).length > 2 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Badge variant="outline" className="cursor-pointer">
                                  +{(campaign.payouts || []).length - 2} more
                                </Badge>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>All Payouts</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(campaign.payouts || []).map((payout, i) => (
                                  <DropdownMenuItem key={i}>
                                    <span className="font-medium">
                                      {formatCountry(payout.country)}:
                                    </span>
                                    <span className="ml-2">
                                      {currencySymbols[payout.currency] || ""}
                                      {payout.amount} {payout.currency}
                                    </span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(campaign.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/campaigns/edit?id=${campaign.id}`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteClick(campaign.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
