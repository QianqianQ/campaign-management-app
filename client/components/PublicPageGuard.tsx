'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface PublicPageGuardProps {
  children: React.ReactNode;
}

export default function PublicPageGuard({ children }: PublicPageGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Do not render anything if user is authenticated (while redirecting)
  if (isAuthenticated) {
    return null;
  }

  // Show the page content for unauthenticated users
  return <>{children}</>;
}