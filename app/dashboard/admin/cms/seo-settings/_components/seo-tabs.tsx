"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useUploadSeoImage } from "@/hooks/use-admin";
import { LuEye, LuInfo, LuCode, LuUpload, LuX, LuTag, LuSearch, LuTrendingUp, LuSave } from "react-icons/lu";
import { FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

interface SEOTabsProps {
  form: UseFormReturn<any>;
  keywordInput: string;
  setKeywordInput: (value: string) => void;
  handleAddKeyword: () => void;
  handleRemoveKeyword: (index: number) => void;
  onSave?: () => void;
  saving?: boolean;
}

export const MetaTab = ({ form, keywordInput, setKeywordInput, handleAddKeyword, handleRemoveKeyword, onSave, saving }: SEOTabsProps) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuTag className="h-5 w-5" />
            Basic Meta Tags
          </CardTitle>
          <CardDescription>Default meta information for your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              placeholder="Your Site Title"
              maxLength={70}
              {...form.register("metaTitle")}
            />
            <p className="text-xs text-muted-foreground">
              {form.watch("metaTitle")?.length || 0}/70 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              placeholder="Brief description of your site"
              maxLength={160}
              rows={3}
              {...form.register("metaDescription")}
            />
            <p className="text-xs text-muted-foreground">
              {form.watch("metaDescription")?.length || 0}/160 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <div className="flex gap-2">
              <Input
                id="metaKeywords"
                placeholder="Add a keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button type="button" onClick={handleAddKeyword}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch("metaKeywords")?.map((keyword: string, index: number) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input
              id="canonicalUrl"
              placeholder="https://example.com"
              {...form.register("canonicalUrl")}
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuEye className="h-5 w-5" />
            Search Preview
          </CardTitle>
          <CardDescription>How your site appears in search results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 rounded-lg border p-4">
            <div className="text-sm text-blue-600">
              {form.watch("metaTitle") || "Your Site Title"}
            </div>
            <div className="text-xs text-green-700">
              {form.watch("canonicalUrl") || "https://example.com"}
            </div>
            <div className="text-xs text-gray-600">
              {form.watch("metaDescription") ||
                "Your site description will appear here. Make it compelling to improve click-through rates."}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <LuInfo className="h-4 w-4 shrink-0 mt-0.5" />
            <p>Keep meta titles under 60 characters for best display</p>
          </div>
          <div className="flex gap-2">
            <LuInfo className="h-4 w-4 shrink-0 mt-0.5" />
            <p>Meta descriptions should be compelling and around 155 characters</p>
          </div>
          <div className="flex gap-2">
            <LuInfo className="h-4 w-4 shrink-0 mt-0.5" />
            <p>Use 3-5 relevant keywords for better targeting</p>
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="lg:col-span-2 flex justify-end">
      <Button type="button" onClick={onSave} disabled={!!saving}>
        {saving ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Saving...
          </>
        ) : (
          <>
            <LuSave className="mr-2 h-4 w-4" />
            Save Meta
          </>
        )}
      </Button>
    </div>
  </div>
);

export const SocialTab = ({ form, onSave, saving }: { form: UseFormReturn<any>; onSave: () => void; saving: boolean }) => {
  const uploadSeoImageMutation = useUploadSeoImage();
  const [ogImagePreview, setOgImagePreview] = useState<string>("");
  const [twitterImagePreview, setTwitterImagePreview] = useState<string>("");

  // Handle OG image upload
  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOgImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const result = await uploadSeoImageMutation.mutateAsync(file);
      form.setValue("ogImage", result.data.url);
    } catch (error) {
      console.error("OG image upload failed:", error);
      setOgImagePreview("");
    }
  };

  // Handle Twitter image upload
  const handleTwitterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTwitterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const result = await uploadSeoImageMutation.mutateAsync(file);
      form.setValue("twitterImage", result.data.url);
    } catch (error) {
      console.error("Twitter image upload failed:", error);
      setTwitterImagePreview("");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaFacebook className="h-5 w-5" />
            Open Graph (Facebook)
          </CardTitle>
          <CardDescription>Configure how links appear on Facebook</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ogTitle">OG Title</Label>
          <Input
            id="ogTitle"
            placeholder="Title for social media"
            maxLength={70}
            {...form.register("ogTitle")}
          />
          <p className="text-xs text-muted-foreground">
            {form.watch("ogTitle")?.length || 0}/70 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ogDescription">OG Description</Label>
          <Textarea
            id="ogDescription"
            placeholder="Description for social media"
            maxLength={160}
            rows={3}
            {...form.register("ogDescription")}
          />
          <p className="text-xs text-muted-foreground">
            {form.watch("ogDescription")?.length || 0}/160 characters
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="ogImage-upload">OG Image</Label>
          
          {/* Preview */}
          {(ogImagePreview || form.watch("ogImage")) && (
            <div className="relative rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-4">
              <button
                type="button"
                onClick={() => {
                  form.setValue("ogImage", "");
                  setOgImagePreview("");
                }}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                title="Remove OG image"
              >
                <LuX className="h-4 w-4" />
              </button>
              <div className="flex items-center justify-center">
                <img
                  src={ogImagePreview || form.watch("ogImage")}
                  alt="OG Image preview"
                  className="max-h-48 w-auto object-contain rounded"
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
              id="ogImage-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleOgImageUpload}
              disabled={uploadSeoImageMutation.isPending}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("ogImage-upload")?.click()}
              disabled={uploadSeoImageMutation.isPending}
              className="w-full"
            >
              {uploadSeoImageMutation.isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <LuUpload className="mr-2 h-4 w-4" />
                  Upload OG Image
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended: 1200x630 pixels. Max 5MB. JPG, PNG, WebP
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebookAppId">Facebook App ID</Label>
          <Input
            id="facebookAppId"
            placeholder="123456789"
            {...form.register("facebookAppId")}
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaTwitter className="h-5 w-5" />
          Twitter Card
        </CardTitle>
        <CardDescription>Configure how links appear on Twitter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="twitterCard">Twitter Card Type</Label>
          <Controller
            name="twitterCard"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterTitle">Twitter Title</Label>
          <Input
            id="twitterTitle"
            placeholder="Title for Twitter"
            maxLength={70}
            {...form.register("twitterTitle")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterDescription">Twitter Description</Label>
          <Textarea
            id="twitterDescription"
            placeholder="Description for Twitter"
            maxLength={160}
            rows={3}
            {...form.register("twitterDescription")}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="twitterImage-upload">Twitter Image</Label>
          
          {/* Preview */}
          {(twitterImagePreview || form.watch("twitterImage")) && (
            <div className="relative rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-4">
              <button
                type="button"
                onClick={() => {
                  form.setValue("twitterImage", "");
                  setTwitterImagePreview("");
                }}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                title="Remove Twitter image"
              >
                <LuX className="h-4 w-4" />
              </button>
              <div className="flex items-center justify-center">
                <img
                  src={twitterImagePreview || form.watch("twitterImage")}
                  alt="Twitter Image preview"
                  className="max-h-48 w-auto object-contain rounded"
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
              id="twitterImage-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleTwitterImageUpload}
              disabled={uploadSeoImageMutation.isPending}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("twitterImage-upload")?.click()}
              disabled={uploadSeoImageMutation.isPending}
              className="w-full"
            >
              {uploadSeoImageMutation.isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <LuUpload className="mr-2 h-4 w-4" />
                  Upload Twitter Image
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended: 1200x675 pixels. Max 5MB. JPG, PNG, WebP
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterSite">Twitter Site Handle</Label>
          <Input
            id="twitterSite"
            placeholder="@yoursite"
            {...form.register("twitterSite")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterCreator">Twitter Creator Handle</Label>
          <Input
            id="twitterCreator"
            placeholder="@creator"
            {...form.register("twitterCreator")}
          />
        </div>
      </CardContent>
    </Card>
      <div className="lg:col-span-2 flex justify-end">
        <Button type="button" onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <LuSave className="mr-2 h-4 w-4" />
              Save Social
            </>
          )}
        </Button>
      </div>
  </div>
  );
};

export const RobotsTab = ({ form, onSave, saving }: { form: UseFormReturn<any>; onSave: () => void; saving: boolean }) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuSearch className="h-5 w-5" />
          Robots Directives
        </CardTitle>
        <CardDescription>Control how search engines crawl your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Index</Label>
            <p className="text-sm text-muted-foreground">
              Allow search engines to index your site
            </p>
          </div>
          <Controller
            name="robotsDirectives.index"
            control={form.control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Follow</Label>
            <p className="text-sm text-muted-foreground">
              Allow search engines to follow links
            </p>
          </div>
          <Controller
            name="robotsDirectives.follow"
            control={form.control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>No Archive</Label>
            <p className="text-sm text-muted-foreground">
              Prevent cached versions of pages
            </p>
          </div>
          <Controller
            name="robotsDirectives.noarchive"
            control={form.control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>No Snippet</Label>
            <p className="text-sm text-muted-foreground">
              Prevent search results snippets
            </p>
          </div>
          <Controller
            name="robotsDirectives.nosnippet"
            control={form.control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>No Image Index</Label>
            <p className="text-sm text-muted-foreground">
              Prevent images from being indexed
            </p>
          </div>
          <Controller
            name="robotsDirectives.noimageindex"
            control={form.control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaGoogle className="h-5 w-5" />
          Google Verification
        </CardTitle>
        <CardDescription>Verify your site with Google</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="googleSiteVerification">Google Site Verification</Label>
          <Input
            id="googleSiteVerification"
            placeholder="google-site-verification-code"
            {...form.register("googleSiteVerification")}
          />
          <p className="text-xs text-muted-foreground">
            Enter the verification code from Google Search Console
          </p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <h4 className="font-medium text-sm mb-2">How to verify:</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Go to Google Search Console</li>
            <li>Add your property</li>
            <li>Choose HTML tag method</li>
            <li>Copy the content value from the meta tag</li>
            <li>Paste it here and save</li>
          </ol>
        </div>
      </CardContent>
    </Card>
    <div className="lg:col-span-2 flex justify-end">
      <Button type="button" onClick={onSave} disabled={saving}>
        {saving ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Saving...
          </>
        ) : (
          <>
            <LuSave className="mr-2 h-4 w-4" />
            Save Robots
          </>
        )}
      </Button>
    </div>
  </div>
);

export const AnalyticsTab = ({ form, onSave, saving }: { form: UseFormReturn<any>; onSave: () => void; saving: boolean }) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuTrendingUp className="h-5 w-5" />
          Google Analytics
        </CardTitle>
        <CardDescription>Track your site's performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
          <Input
            id="googleAnalyticsId"
            placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
            {...form.register("googleAnalyticsId")}
          />
          <p className="text-xs text-muted-foreground">
            Find this in your Google Analytics account
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
          <Input
            id="googleTagManagerId"
            placeholder="GTM-XXXXXXX"
            {...form.register("googleTagManagerId")}
          />
          <p className="text-xs text-muted-foreground">
            Optional: Use GTM to manage all your tracking codes
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaFacebook className="h-5 w-5" />
          Facebook Pixel
        </CardTitle>
        <CardDescription>Track Facebook conversions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
          <Input
            id="facebookPixelId"
            placeholder="123456789012345"
            {...form.register("facebookPixelId")}
          />
          <p className="text-xs text-muted-foreground">
            Find this in your Facebook Events Manager
          </p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <h4 className="font-medium text-sm mb-2">Tracking Benefits:</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Track conversions and events</li>
            <li>Create custom audiences</li>
            <li>Optimize ad campaigns</li>
            <li>Measure ROI</li>
          </ul>
        </div>
      </CardContent>
    </Card>
    <div className="lg:col-span-2 flex justify-end">
      <Button type="button" onClick={onSave} disabled={saving}>
        {saving ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Saving...
          </>
        ) : (
          <>
            <LuSave className="mr-2 h-4 w-4" />
            Save Analytics
          </>
        )}
      </Button>
    </div>
  </div>
);
