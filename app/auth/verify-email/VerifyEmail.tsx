"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

const createFormSchema = () =>
  z.object({
    pin: z
      .string()
      .length(6, { message: "OTP must be 6 digits" })
      .regex(/^[A-Za-z0-9]+$/, { message: "OTP must be numbers" }),
  });

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const FormSchema = createFormSchema();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { pin: "" },
    mode: "onChange",
  });

  const RESEND_WAIT_SECS = 120;
  const [canResendAt, setCanResendAt] = useState<number>(() => {
    const key = token
      ? `verify_email_resend_at_${token}`
      : "verify_email_resend_at";
    const v =
      typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    return v
      ? parseInt(v, 10)
      : Math.floor(Date.now() / 1000) + RESEND_WAIT_SECS;
  });
  const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const secondsLeft = useMemo(
    () => Math.max(0, canResendAt - now),
    [canResendAt, now],
  );
  const countdown = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);
  const canResend = secondsLeft === 0;

  const pinValue = form.watch("pin");

  useEffect(() => {
    if (pinValue && pinValue.length === 6 && form.formState.isValid) {
      const t = setTimeout(() => form.handleSubmit(onSubmit)(), 50);
      return () => clearTimeout(t);
    }
  }, [pinValue, form.formState.isValid]);

  const maskedEmail = useMemo(() => {
    if (!email) return null;
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    const maskedUser =
      user.length <= 2
        ? user[0] + "*"
        : user[0] +
          "*".repeat(Math.max(1, user.length - 2)) +
          user[user.length - 1];
    return `${maskedUser}@${domain}`;
  }, [email]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp: data.pin }),
      });
      const result = await response.json();
      if (response.ok && (result.status || result.success)) {
        toast.success(result.message || "Success");
        router.replace("/dashboard");
        return;
      }
      toast.error(result.message || result.error || "Failed");
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  async function handleResend() {
    if (!token) {
      toast.error("Missing token");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (response.ok && (result.status || result.success)) {
        toast.success(result.message || "Resend successful");
        const next = Math.floor(Date.now() / 1000) + RESEND_WAIT_SECS;
        setCanResendAt(next);
        const key = token
          ? `verify_email_resend_at_${token}`
          : "verify_email_resend_at";
        if (typeof window !== "undefined")
          window.localStorage.setItem(key, String(next));
      } else {
        toast.error(result.message || result.error || "Resend failed");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Verify OTP
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
                </InputOTP>
              </FormControl>
              <FormDescription className="text-sm text-gray-500">
                Enter the OTP sent to your email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            className="h-12 w-full cursor-pointer bg-primary font-medium text-white hover:bg-primary/90"
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
  );
}
