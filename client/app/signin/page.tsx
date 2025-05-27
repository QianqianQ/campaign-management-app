"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SignInForm from "@/components/SignInForm";

export default function SignIn() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('SignIn: isAuthenticated:', isAuthenticated, 'loading:', loading);
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <SignInForm />
    </div>
  );
}
