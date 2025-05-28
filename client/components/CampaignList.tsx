"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Filter, MoreHorizontal, Plus, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
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

import { useCampaigns } from "@/hooks/useCampaigns";
import { CampaignSearchFilters } from "@/lib/api/campaigns";

interface campaignListProps {
  searchFilters: CampaignSearchFilters;
}

// Currency symbols
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
}

export default function CampaignsList({ searchFilters = {} }: campaignListProps) {
  const {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    handleToggleCampaignRunning,
  } = useCampaigns();
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  useEffect(() => {
    fetchCampaigns(searchFilters);
  }, [searchFilters, fetchCampaigns]);

  // Filter campaigns based on search and status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.landing_page_url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Running" && campaign.is_running) ||
      (statusFilter === "Stopped" && !campaign.is_running)

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
              onClick={() => fetchCampaigns(searchFilters)}
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
          <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">Manage your advertising campaigns</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/add">
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
                      <Button variant="ghost" size="sm" className="h-8 p-0 ml-1">
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
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
                          <div className="text-sm text-muted-foreground truncate max-w-[280px]">
                            {campaign.landing_page_url}
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
    </div>
  )
}
