"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import { useSiteSettings, useUpdateSiteSettings, useUploadLogo, useUploadFavicon } from "@/hooks/use-admin";
import type { UpdateSiteSettingsDto } from "@/lib/api/admin";
import {
  LuSave,
  LuGlobe,
  LuImage,
  LuMail,
  LuPhone,
  LuMapPin,
  LuClock,
  LuInfo,
  LuFacebook,
  LuTwitter,
  LuInstagram,
  LuLinkedin,
  LuYoutube,
  LuGithub,
  LuUpload,
  LuX,
} from "react-icons/lu";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

// Validation schema
const siteSettingsSchema = yup.object({
  siteName: yup.string().required("Site name is required").min(2, "Site name must be at least 2 characters"),
  siteUrl: yup.string().url("Must be a valid URL").required("Site URL is required"),
  siteDescription: yup.string().max(500, "Description should be max 500 characters").optional(),
  logo: yup.string().url("Must be a valid URL").optional(),
  favicon: yup.string().url("Must be a valid URL").optional(),
  contactEmail: yup.string().email("Must be a valid email").optional(),
  contactPhone: yup.string().optional(),
  contactAddress: yup.string().optional(),
  businessHours: yup.string().optional(),
  timezone: yup.string().optional(),
  language: yup.string().optional(),
  currency: yup.string().optional(),
  socialLinks: yup.object({
    facebook: yup.string().url("Must be a valid URL").optional(),
    twitter: yup.string().url("Must be a valid URL").optional(),
    instagram: yup.string().url("Must be a valid URL").optional(),
    linkedin: yup.string().url("Must be a valid URL").optional(),
    youtube: yup.string().url("Must be a valid URL").optional(),
    github: yup.string().url("Must be a valid URL").optional(),
  }).optional(),
});

type SiteSettingsFormData = yup.InferType<typeof siteSettingsSchema>;

const SiteSettingsPage = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
  const canViewCmsSettings = !!user?.permissions?.includes("admin.settings.view");
  const canManageCmsSettings = !!user?.permissions?.includes("admin.settings.update");
  const { data: settings, isLoading, error } = useSiteSettings(
    !isAuthLoading && !!user && canViewCmsSettings
  );
  const updateSettingsMutation = useUpdateSiteSettings();
  const uploadLogoMutation = useUploadLogo();
  const uploadFaviconMutation = useUploadFavicon();
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "social">("general");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");

  const form = useForm<SiteSettingsFormData>({
    resolver: yupResolver(siteSettingsSchema) as any,
    defaultValues: {
      siteName: "",
      siteUrl: "",
      siteDescription: "",
      logo: "",
      favicon: "",
      contactEmail: "",
      contactPhone: "",
      contactAddress: "",
      businessHours: "",
      timezone: "UTC",
      language: "en",
      currency: "USD",
      socialLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        github: "",
      },
    },
  });

  // Load settings data into form
  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName || "",
        siteUrl: settings.siteUrl || "",
        siteDescription: settings.siteDescription || "",
        logo: settings.logo || "",
        favicon: settings.favicon || "",
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        contactAddress: settings.contactAddress || "",
        businessHours: settings.businessHours || "",
        timezone: settings.timezone || "UTC",
        language: settings.language || "en",
        currency: settings.currency || "USD",
        socialLinks: {
          facebook: settings.socialLinks?.facebook || "",
          twitter: settings.socialLinks?.twitter || "",
          instagram: settings.socialLinks?.instagram || "",
          linkedin: settings.socialLinks?.linkedin || "",
          youtube: settings.socialLinks?.youtube || "",
          github: settings.socialLinks?.github || "",
        },
      });
    }
  }, [settings, form]);

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const result = await uploadLogoMutation.mutateAsync(file);

      // Update form value
      form.setValue("logo", result.data.url);
    } catch (error) {
      console.error("Logo upload failed:", error);
      setLogoPreview("");
    }
  };

  // Handle favicon upload
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const result = await uploadFaviconMutation.mutateAsync(file);

      // Update form value
      form.setValue("favicon", result.data.url);
    } catch (error) {
      console.error("Favicon upload failed:", error);
      setFaviconPreview("");
    }
  };

  // Remove logo
  const removeLogo = () => {
    form.setValue("logo", "");
    setLogoPreview("");
  };

  // Remove favicon
  const removeFavicon = () => {
    form.setValue("favicon", "");
    setFaviconPreview("");
  };

  const onSubmit = async (data: SiteSettingsFormData) => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to update site settings.");
      return;
    }
    updateSettingsMutation.mutate(data as UpdateSiteSettingsDto);
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
            You do not have permission to view site settings.
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
          <p className="mt-4 text-lg font-medium text-destructive">Error loading site settings</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your site configuration and branding
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
            Error: {(updateSettingsMutation.error as any)?.message || "Failed to update settings"}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "general"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuGlobe className="h-4 w-4" />
          General
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "contact"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuMail className="h-4 w-4" />
          Contact Information
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "social"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuFacebook className="h-4 w-4" />
          Social Media
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure your site's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name *</Label>
                  <Input
                    id="siteName"
                    placeholder="My Awesome Site"
                    {...form.register("siteName")}
                  />
                  {form.formState.errors.siteName && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.siteName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL *</Label>
                  <Input
                    id="siteUrl"
                    placeholder="https://example.com"
                    {...form.register("siteUrl")}
                  />
                  {form.formState.errors.siteUrl && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.siteUrl.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    placeholder="Brief description of your site"
                    rows={3}
                    {...form.register("siteDescription")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {form.watch("siteDescription")?.length || 0}/500 characters
                  </p>
                  {form.formState.errors.siteDescription && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.siteDescription.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LuImage className="h-5 w-5" />
                  Branding
                </CardTitle>
                <CardDescription>Upload your logo and favicon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-3">
                  <Label htmlFor="logo-upload">Site Logo</Label>
                  
                  {/* Preview */}
                  {(logoPreview || form.watch("logo")) && (
                    <div className="relative rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-4">
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -right-2 -top-2 z-10 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                        title="Remove logo"
                      >
                        <LuX className="h-4 w-4" />
                      </button>
                      <div className="flex items-center justify-center">
                        <img
                          src={logoPreview || form.watch("logo")}
                          alt="Logo preview"
                          className="max-h-32 w-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center gap-3">
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                      onChange={handleLogoUpload}
                      disabled={uploadLogoMutation.isPending}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                      disabled={uploadLogoMutation.isPending}
                      className="w-full"
                    >
                      {uploadLogoMutation.isPending ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <LuUpload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max 5MB. Accepts JPG, PNG, WebP, SVG
                  </p>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-3">
                  <Label htmlFor="favicon-upload">Favicon</Label>
                  
                  {/* Preview */}
                  {(faviconPreview || form.watch("favicon")) && (
                    <div className="relative inline-block rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-4">
                      <button
                        type="button"
                        onClick={removeFavicon}
                        className="absolute -right-2 -top-2 z-10 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                        title="Remove favicon"
                      >
                        <LuX className="h-4 w-4" />
                      </button>
                      <img
                        src={faviconPreview || form.watch("favicon")}
                        alt="Favicon preview"
                        className="h-16 w-16 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center gap-3">
                    <Input
                      id="favicon-upload"
                      type="file"
                      accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml"
                      onChange={handleFaviconUpload}
                      disabled={uploadFaviconMutation.isPending}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("favicon-upload")?.click()}
                      disabled={uploadFaviconMutation.isPending}
                      className="w-full"
                    >
                      {uploadFaviconMutation.isPending ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <LuUpload className="mr-2 h-4 w-4" />
                          Upload Favicon
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max 1MB. Accepts ICO, PNG, SVG
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Localization</CardTitle>
                <CardDescription>Configure language and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    placeholder="UTC"
                    {...form.register("timezone")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    placeholder="en"
                    {...form.register("language")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    placeholder="USD"
                    {...form.register("currency")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LuMail className="h-5 w-5" />
                  Contact Details
                </CardTitle>
                <CardDescription>How users can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@example.com"
                    {...form.register("contactEmail")}
                  />
                  {form.formState.errors.contactEmail && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.contactEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center gap-2">
                    <LuPhone className="h-4 w-4" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    placeholder="+1 (555) 123-4567"
                    {...form.register("contactPhone")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactAddress" className="flex items-center gap-2">
                    <LuMapPin className="h-4 w-4" />
                    Contact Address
                  </Label>
                  <Textarea
                    id="contactAddress"
                    placeholder="123 Main St, City, Country"
                    rows={3}
                    {...form.register("contactAddress")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LuClock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
                <CardDescription>When your business is available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Textarea
                    id="businessHours"
                    placeholder="Mon-Fri: 9:00 AM - 5:00 PM&#10;Sat-Sun: Closed"
                    rows={5}
                    {...form.register("businessHours")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your business hours (one per line)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === "social" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <LuFacebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/yourpage"
                    {...form.register("socialLinks.facebook")}
                  />
                  {form.formState.errors.socialLinks?.facebook && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.socialLinks.facebook.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <LuTwitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/yourhandle"
                    {...form.register("socialLinks.twitter")}
                  />
                  {form.formState.errors.socialLinks?.twitter && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.socialLinks.twitter.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <LuInstagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/yourprofile"
                    {...form.register("socialLinks.instagram")}
                  />
                  {form.formState.errors.socialLinks?.instagram && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.socialLinks.instagram.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Networks</CardTitle>
                <CardDescription>Link to professional platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <LuLinkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/company/yourcompany"
                    {...form.register("socialLinks.linkedin")}
                  />
                  {form.formState.errors.socialLinks?.linkedin && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.socialLinks.linkedin.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <LuYoutube className="h-4 w-4" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    placeholder="https://youtube.com/channel/yourchannel"
                    {...form.register("socialLinks.youtube")}
                  />
                  {form.formState.errors.socialLinks?.youtube && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.socialLinks.youtube.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center gap-2">
                    <LuGithub className="h-4 w-4" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/yourorg"
                    {...form.register("socialLinks.github")}
                  />
                  {form.formState.errors.socialLinks?.github && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.socialLinks.github.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </form>
    </div>
  );
};

export default SiteSettingsPage;
