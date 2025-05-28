'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface PublicPageGuardProps {
  children: React.ReactNode;
}

export default function PublicPageGuard({ children }: PublicPageGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('PublicPageGuard: isAuthenticated:', isAuthenticated, 'loading:', loading);
    // Redirect authenticated users to dashboard
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // Do not render anything if user is authenticated (while redirecting)
  if (isAuthenticated) {
    return null;
  }

  // Show the page content for unauthenticated users
  return <>{children}</>;
}