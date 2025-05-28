'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .trim(),
})

// Infer the type of the form data from the schema
type SignInFormData = z.infer<typeof signInSchema>

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signin, isAuthenticated, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  });

  const returnUrl = searchParams.get('returnUrl') || '/';

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, loading, router, returnUrl]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const onSubmit = (data: SignInFormData) => {
    console.log(data);
    handleSignIn(data);
  }

  const handleSignIn = async (data: SignInFormData) => {
    try {
      const response = await signin(data);
      if (response.success) {
        router.push(returnUrl);
      } else {
        console.log(response.errors);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        console.log("Error signing in:", error.response);
      } else {
        console.error("Error signing in:", error);
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
