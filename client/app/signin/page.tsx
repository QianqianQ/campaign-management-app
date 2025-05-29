"use client";

import SignInForm from "@/components/SignInForm";
import PublicPageGuard from "@/components/PublicPageGuard";

export default function SignIn() {
  return (
    <PublicPageGuard>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <SignInForm />
      </div>
    </PublicPageGuard>
  );
}
