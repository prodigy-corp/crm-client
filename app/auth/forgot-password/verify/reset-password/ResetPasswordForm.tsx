"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/constants";


const PASSWORD_SCHEMA = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

async function resetPassword(
  token: string,
  password: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token, password }),
    });

    const result = await response.json();
    if (!response.ok || !(result.status || result.success)) {
      toast.error(result.message || result.error || "Failed to reset password");
      return false;
    }
    return true;
  } catch (error) {
    toast.error("Something went wrong");
    return false;
  }
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("path");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof PASSWORD_SCHEMA>>({
    resolver: zodResolver(PASSWORD_SCHEMA),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. Please try again.");
      router.replace("/auth/forgot-password");
    }
  }, [token, router]);

  const onSubmit = async (data: z.infer<typeof PASSWORD_SCHEMA>) => {
    if (!token || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await resetPassword(token, data.password);
      if (result) {
        toast.success("Password reset successfully");
        setTimeout(() => router.replace("/auth/login"), 2000);
      }
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error("Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold text-gray-900">
            Invalid reset link
          </h1>
          <p className="mb-6 text-gray-600">
            Invalid reset link. Please try again.
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="">
          <h1 className="text-3xl font-semibold text-gray-900">
            Reset Password
          </h1>
          <p className="mt-2 text-gray-600">Reset your password to continue.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full cursor-pointer bg-primary font-medium text-white hover:bg-primary/90"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Link href="/auth/login" className="text-gray-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}