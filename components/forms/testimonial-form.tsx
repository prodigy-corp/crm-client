"use client";

import { useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  useCreateTestimonial, 
  useUpdateTestimonial, 
  useUploadTestimonialAvatar 
} from "@/hooks/use-admin";
import type { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from "@/lib/api/admin";
import { 
  LuSave, 
  LuX, 
  LuUpload, 
  LuStar, 
  LuUser,
  LuBuilding,
  LuQuote,
  LuImage
} from "react-icons/lu";

const testimonialSchema = yup.object({
  name: yup.string().required("Name is required").max(100, "Name must be less than 100 characters"),
  position: yup.string().optional().max(100, "Position must be less than 100 characters"),
  company: yup.string().optional().max(100, "Company must be less than 100 characters"),
  content: yup.string().required("Content is required").max(1000, "Content must be less than 1000 characters"),
  rating: yup.number().optional().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  isActive: yup.boolean().default(true),
  isFeatured: yup.boolean().default(false),
  displayOrder: yup.number().optional().min(0, "Display order must be positive"),
});

type TestimonialFormValues = {
  name: string;
  position: string | undefined;
  company: string | undefined;
  content: string;
  rating: number | undefined;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number | undefined;
};

interface TestimonialFormProps {
  testimonial?: Testimonial;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TestimonialForm = ({ testimonial, onSuccess, onCancel }: TestimonialFormProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(testimonial?.avatar || null);

  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const uploadMutation = useUploadTestimonialAvatar();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TestimonialFormValues>({
    resolver: yupResolver(testimonialSchema) as unknown as Resolver<TestimonialFormValues>,
    defaultValues: {
      name: testimonial?.name || "",
      position: testimonial?.position ?? undefined,
      company: testimonial?.company ?? undefined,
      content: testimonial?.content || "",
      rating: testimonial?.rating ?? undefined,
      isActive: testimonial?.isActive ?? true,
      isFeatured: testimonial?.isFeatured ?? false,
      displayOrder: testimonial?.displayOrder ?? undefined,
    },
  });

  const watchedRating = watch("rating");

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<TestimonialFormValues> = async (data) => {
    try {
      let avatarUrl = testimonial?.avatar;

      // Upload avatar if a new file is selected
      if (avatarFile) {
        const uploadResult = await uploadMutation.mutateAsync(avatarFile);
        avatarUrl = uploadResult.data.url;
      }

      const testimonialData = {
        ...data,
        avatar: avatarUrl,
      };

      if (testimonial) {
        await updateMutation.mutateAsync({
          id: testimonial.id,
          data: testimonialData as UpdateTestimonialDto,
        });
      } else {
        await createMutation.mutateAsync(testimonialData as CreateTestimonialDto);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={interactive ? () => setValue("rating", i + 1) : undefined}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <LuStar
              className={`w-5 h-5 ${
                i < rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        {interactive && (
          <button
            type="button"
            onClick={() => setValue("rating", undefined)}
            className="ml-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>
    );
  };

  const isLoading = isSubmitting || createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuUser className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter customer name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                {...register("position")}
                placeholder="e.g., CEO, Marketing Manager"
                className={errors.position ? "border-red-500" : ""}
              />
              {errors.position && (
                <p className="text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                {...register("company")}
                placeholder="Company name"
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && (
                <p className="text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <LuUser className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload customer avatar (optional). Recommended: 200x200px
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonial Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuQuote className="h-5 w-5" />
            Testimonial Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Testimonial Content *</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Enter the testimonial content..."
              rows={5}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
            <p className="text-xs text-gray-500">
              {watch("content")?.length || 0}/1000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label>Rating (Optional)</Label>
            <div className="flex items-center gap-4">
              {renderStars(watchedRating || 0, true)}
              <span className="text-sm text-gray-600">
                {watchedRating ? `${watchedRating} out of 5 stars` : "No rating"}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                id="isFeatured"
                checked={watch("isFeatured")}
                onCheckedChange={(checked) => setValue("isFeatured", checked)}
              />
              <Label htmlFor="isFeatured">Featured</Label>
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
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-start gap-4">
              {avatarPreview ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <LuUser className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <blockquote className="text-gray-700 italic mb-4">
                  "{watch("content") || "Your testimonial content will appear here..."}"
                </blockquote>
                
                {watchedRating && (
                  <div className="mb-3">
                    {renderStars(watchedRating)}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {watch("name") || "Customer Name"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {watch("position") && watch("company") 
                        ? `${watch("position")} at ${watch("company")}`
                        : watch("position") || watch("company") || "Position / Company"
                      }
                    </div>
                  </div>
                  {watch("isFeatured") && (
                    <Badge variant="outline" className="ml-auto">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
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
          {testimonial ? "Update Testimonial" : "Create Testimonial"}
        </Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
