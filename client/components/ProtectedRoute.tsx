'use client'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(isAuthenticated, loading);
    // if not authenticated and not loading, redirect to signin
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router])

  // if loading, show loading screen
  if (loading) {
    return <div>Loading...</div>;
  }

  // if not authenticated, return null
  if (!isAuthenticated) {
    return null;
  }

  // if authenticated, return children
  return <>{children}</>;
}
