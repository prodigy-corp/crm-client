"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  useCreateBanner, 
  useUpdateBanner, 
  useUploadContentImage 
} from "@/hooks/use-admin";
import type { Banner, CreateBannerDto, UpdateBannerDto } from "@/lib/api/admin";
import { 
  LuSave, 
  LuX, 
  LuUpload, 
  LuCalendar, 
  LuPalette,
  LuInfo,
  LuTriangle,
  LuCheck,
  LuMegaphone,
  LuImage
} from "react-icons/lu";

const bannerSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(100, "Title must be less than 100 characters"),
  message: yup.string().optional().max(500, "Message must be less than 500 characters"),
  type: yup
    .string()
    .oneOf(["info", "warning", "success", "error", "promotion"]) 
    .required("Type is required"),
  backgroundColor: yup.string().optional().matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  textColor: yup.string().optional().matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  buttonText: yup.string().optional().max(50, "Button text must be less than 50 characters"),
  buttonUrl: yup.string().optional().url("Must be a valid URL"),
  buttonColor: yup.string().optional().matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  isActive: yup.boolean().default(true),
  isDismissible: yup.boolean().default(true),
  // Use string to work with input type="datetime-local"
  startDate: yup.string().nullable().optional(),
  endDate: yup.string().nullable().optional(),
  displayOrder: yup.number().optional().min(0, "Display order must be positive"),
});

type BannerFormValues = {
  title: string;
  message: string | undefined;
  type: "info" | "warning" | "success" | "error" | "promotion";
  backgroundColor: string | undefined;
  textColor: string | undefined;
  buttonText: string | undefined;
  buttonUrl: string | undefined;
  buttonColor: string | undefined;
  isActive: boolean;
  isDismissible: boolean;
  startDate: string | undefined;
  endDate: string | undefined;
  displayOrder: number | undefined;
};

interface BannerFormProps {
  banner?: Banner;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BannerForm = ({ banner, onSuccess, onCancel }: BannerFormProps) => {
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(banner?.icon || null);

  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const uploadMutation = useUploadContentImage();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BannerFormValues>({
    resolver: yupResolver(bannerSchema) as unknown as Resolver<BannerFormValues>,
    defaultValues: {
      title: banner?.title || "",
      message: banner?.message ?? undefined,
      type: (banner?.type as BannerFormValues["type"]) || "info",
      backgroundColor: banner?.backgroundColor ?? undefined,
      textColor: banner?.textColor ?? undefined,
      buttonText: banner?.buttonText ?? undefined,
      buttonUrl: banner?.buttonUrl ?? undefined,
      buttonColor: banner?.buttonColor ?? undefined,
      isActive: banner?.isActive ?? true,
      isDismissible: banner?.isDismissible ?? true,
      startDate: banner?.startDate ? banner.startDate.slice(0, 16) : undefined,
      endDate: banner?.endDate ? banner.endDate.slice(0, 16) : undefined,
      displayOrder: banner?.displayOrder ?? undefined,
    },
  });

  const watchedType = watch("type");
  const watchedBackgroundColor = watch("backgroundColor");
  const watchedTextColor = watch("textColor");

  // Auto-set colors based on type
  useEffect(() => {
    if (!watchedBackgroundColor || !watchedTextColor) {
      const typeColors = {
        info: { bg: "#EBF8FF", text: "#1E40AF", button: "#3B82F6" },
        warning: { bg: "#FFFBEB", text: "#92400E", button: "#F59E0B" },
        success: { bg: "#F0FDF4", text: "#166534", button: "#10B981" },
        error: { bg: "#FEF2F2", text: "#DC2626", button: "#EF4444" },
        promotion: { bg: "#FAF5FF", text: "#7C3AED", button: "#8B5CF6" },
      };

      const colors = typeColors[watchedType as keyof typeof typeColors];
      if (colors && !watchedBackgroundColor) {
        setValue("backgroundColor", colors.bg);
      }
      if (colors && !watchedTextColor) {
        setValue("textColor", colors.text);
      }
    }
  }, [watchedType, watchedBackgroundColor, watchedTextColor, setValue]);

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<BannerFormValues> = async (data) => {
    try {
      let iconUrl = banner?.icon;

      // Upload icon if a new file is selected
      if (iconFile) {
        const uploadResult = await uploadMutation.mutateAsync(iconFile);
        iconUrl = uploadResult.data.url;
      }

      const bannerData = {
        ...data,
        icon: iconUrl,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      };

      if (banner) {
        await updateMutation.mutateAsync({
          id: banner.id,
          data: bannerData as UpdateBannerDto,
        });
      } else {
        await createMutation.mutateAsync(bannerData as CreateBannerDto);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to save banner:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <LuInfo className="h-4 w-4" />;
      case "warning":
        return <LuTriangle className="h-4 w-4" />;
      case "success":
        return <LuCheck className="h-4 w-4" />;
      case "error":
        return <LuX className="h-4 w-4" />;
      case "promotion":
        return <LuMegaphone className="h-4 w-4" />;
      default:
        return <LuInfo className="h-4 w-4" />;
    }
  };

  const isLoading = isSubmitting || createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter banner title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <div className="relative">
                <select
                  id="type"
                  {...register("type")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="promotion">Promotion</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {getTypeIcon(watchedType)}
                </div>
              </div>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Enter banner message (optional)"
              rows={3}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Styling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuPalette className="h-5 w-5" />
            Styling & Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  {...register("backgroundColor")}
                  placeholder="#FFFFFF"
                  className={errors.backgroundColor ? "border-red-500" : ""}
                />
                <div
                  className="w-10 h-10 rounded border border-gray-300"
                  style={{ backgroundColor: watchedBackgroundColor || "#FFFFFF" }}
                />
              </div>
              {errors.backgroundColor && (
                <p className="text-sm text-red-600">{errors.backgroundColor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  {...register("textColor")}
                  placeholder="#000000"
                  className={errors.textColor ? "border-red-500" : ""}
                />
                <div
                  className="w-10 h-10 rounded border border-gray-300"
                  style={{ backgroundColor: watchedTextColor || "#000000" }}
                />
              </div>
              {errors.textColor && (
                <p className="text-sm text-red-600">{errors.textColor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonColor">Button Color</Label>
              <div className="flex gap-2">
                <Input
                  id="buttonColor"
                  {...register("buttonColor")}
                  placeholder="#3B82F6"
                  className={errors.buttonColor ? "border-red-500" : ""}
                />
                <div
                  className="w-10 h-10 rounded border border-gray-300"
                  style={{ backgroundColor: watch("buttonColor") || "#3B82F6" }}
                />
              </div>
              {errors.buttonColor && (
                <p className="text-sm text-red-600">{errors.buttonColor.message}</p>
              )}
            </div>
          </div>

          {/* Icon Upload */}
          <div className="space-y-2">
            <Label>Custom Icon</Label>
            <div className="flex items-center gap-4">
              {iconPreview && (
                <div className="w-12 h-12 rounded border border-gray-300 flex items-center justify-center bg-gray-50">
                  <img src={iconPreview} alt="Icon preview" className="w-8 h-8 object-contain" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a custom icon (optional). Recommended size: 24x24px
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Card>
        <CardHeader>
          <CardTitle>Action Button (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                {...register("buttonText")}
                placeholder="Learn More"
                className={errors.buttonText ? "border-red-500" : ""}
              />
              {errors.buttonText && (
                <p className="text-sm text-red-600">{errors.buttonText.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonUrl">Button URL</Label>
              <Input
                id="buttonUrl"
                {...register("buttonUrl")}
                placeholder="https://example.com"
                className={errors.buttonUrl ? "border-red-500" : ""}
              />
              {errors.buttonUrl && (
                <p className="text-sm text-red-600">{errors.buttonUrl.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule & Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuCalendar className="h-5 w-5" />
            Schedule & Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (Optional)</Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...register("startDate")}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register("endDate")}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                {...register("displayOrder")}
                placeholder="0"
                className={errors.displayOrder ? "border-red-500" : ""}
              />
              {errors.displayOrder && (
                <p className="text-sm text-red-600">{errors.displayOrder.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isDismissible"
                checked={watch("isDismissible")}
                onCheckedChange={(checked) => setValue("isDismissible", checked)}
              />
              <Label htmlFor="isDismissible">Dismissible</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-4 rounded-lg border-l-4 flex items-center gap-3"
            style={{
              backgroundColor: watchedBackgroundColor || "#EBF8FF",
              color: watchedTextColor || "#1E40AF",
              borderLeftColor: watchedTextColor || "#1E40AF",
            }}
          >
            {iconPreview ? (
              <img src={iconPreview} alt="Icon" className="w-5 h-5 object-contain" />
            ) : (
              getTypeIcon(watchedType)
            )}
            <div className="flex-1">
              <div className="font-semibold">{watch("title") || "Banner Title"}</div>
              {watch("message") && (
                <div className="text-sm opacity-90 mt-1">{watch("message")}</div>
              )}
            </div>
            {watch("buttonText") && (
              <Button
                size="sm"
                style={{
                  backgroundColor: watch("buttonColor") || "#3B82F6",
                  color: "#FFFFFF",
                }}
              >
                {watch("buttonText")}
              </Button>
            )}
            {watch("isDismissible") && (
              <Button variant="ghost" size="sm">
                <LuX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          ) : (
            <LuSave className="mr-2 h-4 w-4" />
          )}
          {banner ? "Update Banner" : "Create Banner"}
        </Button>
      </div>
    </form>
  );
};

export default BannerForm;
