'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthGuard from '@/components/AuthGuard';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show dashboard for authenticated users
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
