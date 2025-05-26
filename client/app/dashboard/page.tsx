"use client"

import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

import CampaignList from "@/components/CampaignList";

export default function Dashboard() {
  const { signout, user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if not authenticated and not loading, redirect to signin
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]);

  // if loading or not authenticated, show loading screen
  if (loading || !isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
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
      <CampaignList />
    </div>
  );
}
