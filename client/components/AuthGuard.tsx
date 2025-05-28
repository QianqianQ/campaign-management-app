'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Redirect unauthenticated users to signin with return URL
        const returnUrl = encodeURIComponent(pathname);
        router.push(`/signin?returnUrl=${returnUrl}`);
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Do not render anything if user is unauthenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
