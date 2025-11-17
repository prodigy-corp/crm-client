"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/constants";
import { Route } from "next";

const ForgetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (data: FieldValues) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (res.ok && (result.status || result.success)) {
        setEmailSent(true);
        toast.success(result.message || "reset email sent");
        setTimeout(() => {
          router.push(`/auth/forget-password/verify?email=${encodeURIComponent(String(data.email))}` as Route
          );
        }, 800);
      } else {
        toast.error(
          result.message || result.error || "failed to send reset email",
        );
      }
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast.error("reset email failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = watch("email");

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-[32px] leading-[40px] font-[600] text-[#1A1A1A]">
            reset email sent
          </h1>
          <p className="mt-2 text-[16px] leading-[24px] font-[400] text-[#666666]">
            check your email for a reset code
          </p>
        </div>
        <div className="text-center">
          <p className="text-[16px] leading-[24px] font-[400] text-[#666666]">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:underline"
            >
              back-to-signin
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
      <div>
        <h1 className="text-[32px] leading-[40px] font-[600] text-[#1A1A1A]">
          forgot password
        </h1>
        <p className="mt-2 text-[16px] leading-[24px] font-[400] text-[#666666]">
          enter your email address to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="w-full">
          <Input
            type="email"
            className="w-[420px] rounded-[10px] p-[10px] py-[18px] text-[16px] leading-[24px] font-[600]"
            placeholder="Enter your email address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message as string}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!email || isSubmitting}
          className={`w-full rounded-[10px] p-[10px] py-[12px] text-[16px] leading-[24px] font-[600] ${
            email && !isSubmitting
              ? "cursor-pointer bg-primary text-white"
              : "cursor-not-allowed bg-primary text-white"
          }`}
        >
          {isSubmitting ? "sending" : "send reset code"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-[16px] leading-[24px] font-[400] text-[#666666]">
          <Link href="/auth/login" className="text-gray-600 hover:underline">
            back-to-signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;