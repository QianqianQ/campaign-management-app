'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

import apiClient from "@/services/api";

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  password_confirm: z
    .string()
    .min(1, "Confirm password is required")
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"]
})

// Infer the type of the form data from the schema
type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = (data: SignUpFormData) => {
    console.log(data);
    signUp(data);
  }

  const signUp = async (data: SignUpFormData) => {
    try {
      const response = await apiClient.post("/signup/", data);
      if (response.status === 201) {
        router.push("/signin/");
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        console.log("Error signing up:", error.response);
      } else {
        console.error("Error signing up:", error);
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
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
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="password_confirm"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              {...register("password_confirm")}
            />
            {errors.password_confirm && (
              <p className="text-sm text-red-500">{errors.password_confirm.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/signin" className="font-medium text-primary hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
