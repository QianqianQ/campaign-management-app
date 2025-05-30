"use client";

import SignUpForm from "@/components/SignUpForm";
import PublicPageGuard from "@/components/PublicPageGuard";

export default function SignupPage() {
  return (
    <PublicPageGuard>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">
                Create a new account
              </h1>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>
    </PublicPageGuard>
  );
}
