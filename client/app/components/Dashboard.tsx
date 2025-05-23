"use client"

import { useState, useEffect } from "react";

import { healthCheck } from "@/services/api";

export default function Dashboard() {

    const [healthCheckResult, setHealthCheckResult] = useState<string | null>(null);

    useEffect(() => {
        healthCheck().then((data) => setHealthCheckResult(data.message));
        console.log("Connect to backend API: ", healthCheckResult);
    }, [healthCheckResult]);

  return (
    <div>
      <h1>Welcome to Campaign Management Portal</h1>
      <p>{healthCheckResult}</p>
    </div>
  );
}
