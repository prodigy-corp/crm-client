"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import { useSEOSettings, useUpdateSEOSettings } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import type { UpdateSEOSettingsDto } from "@/lib/api/admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  LuInfo,
  LuSave,
  LuSearch,
  LuShare2,
  LuTag,
  LuTrendingUp
} from "react-icons/lu";
import { toast } from "sonner";
import * as yup from "yup";
import { AnalyticsTab, MetaTab, RobotsTab, SocialTab } from "./_components/seo-tabs";

// Validation schema
const seoSettingsSchema = yup.object({
  metaTitle: yup.string().max(70, "Meta title should be max 70 characters").optional(),
  metaDescription: yup.string().max(160, "Meta description should be max 160 characters").optional(),
  metaKeywords: yup.array().of(yup.string()).optional(),
  ogTitle: yup.string().max(70, "OG title should be max 70 characters").optional(),
  ogDescription: yup.string().max(160, "OG description should be max 160 characters").optional(),
  ogImage: yup.string().url("Must be a valid URL").optional(),
  twitterCard: yup.string().oneOf(["summary", "summary_large_image", "app", "player"]).optional(),
  twitterTitle: yup.string().max(70, "Twitter title should be max 70 characters").optional(),
  twitterDescription: yup.string().max(160, "Twitter description should be max 160 characters").optional(),
  twitterImage: yup.string().url("Must be a valid URL").optional(),
  twitterSite: yup.string().optional(),
  twitterCreator: yup.string().optional(),
  canonicalUrl: yup.string().url("Must be a valid URL").optional(),
  robotsDirectives: yup.object({
    index: yup.boolean().optional(),
    follow: yup.boolean().optional(),
    noarchive: yup.boolean().optional(),
    nosnippet: yup.boolean().optional(),
    noimageindex: yup.boolean().optional(),
  }).optional(),
  googleSiteVerification: yup.string().optional(),
  googleAnalyticsId: yup.string().optional(),
  googleTagManagerId: yup.string().optional(),
  facebookPixelId: yup.string().optional(),
  facebookAppId: yup.string().optional(),
});

type SEOSettingsFormData = yup.InferType<typeof seoSettingsSchema>;

const SEOSettingsPage = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
  const canViewCmsSettings = !!user?.permissions?.includes("admin.settings.view");
  const canManageCmsSettings = !!user?.permissions?.includes("admin.settings.update");
  const { data: settingsRes, isLoading, error } = useSEOSettings(
    !isAuthLoading && !!user && canViewCmsSettings
  );
  const updateSettingsMutation = useUpdateSEOSettings();
  const [activeTab, setActiveTab] = useState<"meta" | "social" | "robots" | "analytics">("meta");
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<SEOSettingsFormData>({
    resolver: yupResolver(seoSettingsSchema) as any,
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterCard: "summary_large_image",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      twitterSite: "",
      twitterCreator: "",
      canonicalUrl: "",
      robotsDirectives: {
        index: true,
        follow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      },
      googleSiteVerification: "",
      googleAnalyticsId: "",
      googleTagManagerId: "",
      facebookPixelId: "",
      facebookAppId: "",
    },
  });

  // Load settings data into form
  useEffect(() => {
    const s = settingsRes?.data;
    if (s) {
      form.reset({
        metaTitle: s.metaTitle || "",
        metaDescription: s.metaDescription || "",
        metaKeywords: s.metaKeywords || [],
        ogTitle: s.ogTitle || "",
        ogDescription: s.ogDescription || "",
        ogImage: s.ogImage || "",
        twitterCard: s.twitterCard || "summary_large_image",
        twitterTitle: s.twitterTitle || "",
        twitterDescription: s.twitterDescription || "",
        twitterImage: s.twitterImage || "",
        twitterSite: s.twitterSite || "",
        twitterCreator: s.twitterCreator || "",
        canonicalUrl: s.canonicalUrl || "",
        robotsDirectives: {
          index: s.robotsDirectives?.index ?? true,
          follow: s.robotsDirectives?.follow ?? true,
          noarchive: s.robotsDirectives?.noarchive ?? false,
          nosnippet: s.robotsDirectives?.nosnippet ?? false,
          noimageindex: s.robotsDirectives?.noimageindex ?? false,
        },
        googleSiteVerification: s.googleSiteVerification || "",
        googleAnalyticsId: s.googleAnalyticsId || "",
        googleTagManagerId: s.googleTagManagerId || "",
        facebookPixelId: s.facebookPixelId || "",
        facebookAppId: s.facebookAppId || "",
      });
    }
  }, [settingsRes, form]);

  const onSubmit = async (data: SEOSettingsFormData) => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to update SEO settings.");
      return;
    }
    updateSettingsMutation.mutate(data as UpdateSEOSettingsDto);
  };

  // Per-tab saves
  const saveMeta = () => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to update SEO settings.");
      return;
    }
    form.handleSubmit((data) => {
      const keywords = Array.isArray(data.metaKeywords)
        ? (data.metaKeywords.filter((k): k is string => typeof k === "string" && k.trim().length > 0))
        : undefined;
      const payload: UpdateSEOSettingsDto = {
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
        metaKeywords: keywords && keywords.length ? keywords : undefined,
        canonicalUrl: data.canonicalUrl || undefined,
      };
      updateSettingsMutation.mutate(payload);
    })();
  };

  const saveSocial = () => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to update SEO settings.");
      return;
    }
    form.handleSubmit((data) => {
      const payload: UpdateSEOSettingsDto = {
        ogTitle: data.ogTitle || undefined,
        ogDescription: data.ogDescription || undefined,
        ogImage: data.ogImage || undefined,
        facebookAppId: data.facebookAppId || undefined,
        twitterCard: data.twitterCard || undefined,
        twitterTitle: data.twitterTitle || undefined,
        twitterDescription: data.twitterDescription || undefined,
        twitterImage: data.twitterImage || undefined,
        twitterSite: data.twitterSite || undefined,
        twitterCreator: data.twitterCreator || undefined,
      };
      updateSettingsMutation.mutate(payload);
    })();
  };

  const saveRobots = () => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to update SEO settings.");
      return;
    }
    form.handleSubmit((data) => {
      const payload: UpdateSEOSettingsDto = {
        robotsDirectives: {
          index: data.robotsDirectives?.index,
          follow: data.robotsDirectives?.follow,
          noarchive: data.robotsDirectives?.noarchive,
          nosnippet: data.robotsDirectives?.nosnippet,
          noimageindex: data.robotsDirectives?.noimageindex,
        },
        googleSiteVerification: data.googleSiteVerification || undefined,
      };
      updateSettingsMutation.mutate(payload);
    })();
  };

  const saveAnalytics = () => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to update SEO settings.");
      return;
    }
    form.handleSubmit((data) => {
      const payload: UpdateSEOSettingsDto = {
        googleAnalyticsId: data.googleAnalyticsId || undefined,
        googleTagManagerId: data.googleTagManagerId || undefined,
        facebookPixelId: data.facebookPixelId || undefined,
      };
      updateSettingsMutation.mutate(payload);
    })();
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = form.getValues("metaKeywords") || [];
      form.setValue("metaKeywords", [...currentKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const currentKeywords = form.getValues("metaKeywords") || [];
    form.setValue(
      "metaKeywords",
      currentKeywords.filter((_, i) => i !== index)
    );
  };
  if (isAuthLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isAuthError || !user) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <LuInfo className="mx-auto h-12 w-12 text-destructive" />
          <p className="mt-4 text-lg font-medium text-destructive">Failed to load user information</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!canViewCmsSettings) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <LuInfo className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Access denied</p>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to view SEO settings.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <LuInfo className="mx-auto h-12 w-12 text-destructive" />
          <p className="mt-4 text-lg font-medium text-destructive">Error loading SEO settings</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {(error as any)?.message || "Please check your connection and try again"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Optimize your site for search engines and social media
          </p>
        </div>

        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={updateSettingsMutation.isPending || !canManageCmsSettings}
        >
          {updateSettingsMutation.isPending ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <LuSave className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Error Display */}
      {updateSettingsMutation.isError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            Error: {(updateSettingsMutation.error as any)?.message || "Failed to update SEO settings"}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("meta")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "meta"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuTag className="h-4 w-4" />
          Meta Tags
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "social"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuShare2 className="h-4 w-4" />
          Social Media
        </button>
        <button
          onClick={() => setActiveTab("robots")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "robots"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuSearch className="h-4 w-4" />
          Search Engines
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "analytics"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuTrendingUp className="h-4 w-4" />
          Analytics
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {activeTab === "meta" && (
          <MetaTab
            form={form}
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            handleAddKeyword={handleAddKeyword}
            handleRemoveKeyword={handleRemoveKeyword}
            onSave={saveMeta}
            saving={updateSettingsMutation.isPending}
          />
        )}

        {activeTab === "social" && (
          <SocialTab
            form={form}
            onSave={saveSocial}
            saving={updateSettingsMutation.isPending}
          />
        )}

        {activeTab === "robots" && (
          <RobotsTab
            form={form}
            onSave={saveRobots}
            saving={updateSettingsMutation.isPending}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab
            form={form}
            onSave={saveAnalytics}
            saving={updateSettingsMutation.isPending}
          />
        )}
      </form>
    </div>
  );
};

export default SEOSettingsPage;
