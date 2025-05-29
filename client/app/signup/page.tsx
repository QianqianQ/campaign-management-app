"use client";

import SignUpForm from "@/components/SignUpForm";
import PublicPageGuard from "@/components/PublicPageGuard";

export default function SignupPage() {
  return (
    <PublicPageGuard>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <SignUpForm />
      </div>
    </PublicPageGuard>
  );
}
