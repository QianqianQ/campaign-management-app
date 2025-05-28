"use client";

import SignUpForm from "@/components/SignUpForm";
import PublicPageGuard from "@/components/PublicPageGuard";

export default function SignupPage() {
  return (
    <PublicPageGuard>
      <div className="container mx-auto p-4">
        <SignUpForm />
      </div>
    </PublicPageGuard>
  );
}
