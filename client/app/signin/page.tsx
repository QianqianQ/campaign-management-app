"use client";

import SignInForm from "@/components/SignInForm";
import PublicPageGuard from "@/components/PublicPageGuard";

export default function SignIn() {
  return (
    <PublicPageGuard>
      <div className="container mx-auto p-4">
        <SignInForm />
      </div>
    </PublicPageGuard>
  );
}
