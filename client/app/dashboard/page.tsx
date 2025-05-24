"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const email = localStorage.getItem('user_email');
    if (token && email) {
      setUserEmail(email);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Campaign Management Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Logged in as: {userEmail}</p>
        </CardContent>
      </Card>
    </div>
  );
}
