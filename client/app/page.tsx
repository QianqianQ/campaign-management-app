'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthGuard from '@/components/AuthGuard';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show dashboard for authenticated users
  if (isAuthenticated) {
    return (
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    );
  }

  // Render nothing for unauthenticated users
  return null;
}
