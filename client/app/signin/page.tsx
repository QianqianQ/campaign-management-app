"use client";

import SignInForm from "@/components/SignInForm";
import PublicPageGuard from "@/components/PublicPageGuard";

export default function SignIn() {
  return (
    <PublicPageGuard>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">
                Welcome to the Campaign Management Portal
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Create an account or sign in to continue
              </p>
            </div>
          </div>

          {/* Sign In Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <SignInForm />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-sm text-amber-800 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Having trouble signing in? Please contact customer support
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicPageGuard>
  );
}
