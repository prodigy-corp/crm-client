"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { API_BASE_URL } from "@/lib/constants";
import { Route } from "next";

const OTP_SCHEMA = z.object({
  pin: z.string().length(6, "Enter 6-digit code"),
});

export function VerifyOtpPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");
  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof OTP_SCHEMA>>({
    resolver: zodResolver(OTP_SCHEMA),
    defaultValues: { pin: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const pinValue = form.watch("pin");
  const canResend = Boolean(email) && resendCooldown === 0;
  const countdown = resendCooldown;

  // Single useEffect for countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const maskedEmail = email ? email.replace(/(.{2}).*(@.*)/, "$1***$2") : null;

  // Form submission handler - only called when user clicks submit
  const onSubmit = async (data: z.infer<typeof OTP_SCHEMA>) => {
    if (isSubmitting || data.pin.length !== 6) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp: data.pin }),
      });

      const result = await response.json();

      if (response.ok && (result.status || result.success)) {
        toast.success("success");

        if (result.token) {
          router.replace(
            `/auth/forget-password/verify/reset-password?path=${result.token}` as Route
          );
        } else if (redirect) {
          router.replace(redirect as Route);
        } else {
          router.replace("/");
        }
      } else {
        toast.error(result.message || result.error || "failed");
      }
    } catch (error) {
      toast.error("something-wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean resend handler
  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, type: "VERIFY_EMAIL" }),
      });

      const result = await response.json();

      if (response.ok && (result.status || result.success)) {
        toast.success(result.message || "resend-success");
        setResendCooldown(120); // 2 minutes
      } else {
        toast.error(result.message || result.error || "resend-failed");
      }
    } catch (error) {
      toast.error("something-wrong");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-2 md:px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-6"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="mx-auto w-full max-w-md">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Enter 6-digit code
                </FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    onChange={(val) => {
                      const cleaned = val
                        .replace(/[^A-Za-z0-9]/g, "")
                        .toUpperCase();
                      field.onChange(cleaned);
                    }}
                    onPaste={(e: React.ClipboardEvent) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text");
                      const cleaned = text
                        .replace(/[^A-Za-z0-9]/g, "")
                        .toUpperCase()
                        .slice(0, 6);
                      if (cleaned) {
                        form.setValue("pin", cleaned, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                    className="[&>*]:gap-2"
                  >
                    <div className="flex w-full">
                      <InputOTPGroup className="space-x-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className={`caret-brand-dark h-12 w-12 rounded-lg border-2 bg-white text-base transition ${
                              form.formState.errors.pin
                                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                                : "border-brand-dark/40 text-brand-dark focus-visible:ring-brand-dark/30 focus-visible:border-brand-dark focus-visible:ring-2"
                            }`}
                          />
                        ))}
                      </InputOTPGroup>
                    </div>
                  </InputOTP>
                </FormControl>
                <FormDescription className="text-center text-sm text-gray-500">
                  {maskedEmail
                    ? "Enter the OTP sent to your email"
                    : "Enter the OTP sent to your phone number"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center gap-3">
            <Button
              type="submit"
              className="h-12 cursor-pointer bg-primary font-medium text-white hover:bg-primary/90"
              disabled={!form.formState.isValid || (pinValue?.length ?? 0) < 6}
            >
              Verify
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={!canResend}
              className="border-primary text-primary hover:bg-primary/5 disabled:opacity-60"
            >
              {canResend ? "Resend" : `Resend in ${countdown}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}