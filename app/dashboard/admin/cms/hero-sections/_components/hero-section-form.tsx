"use client";

import { z } from "zod";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHeroSection, useUpdateHeroSection, useUploadHeroImage } from "@/hooks/use-admin";
import type { HeroSection } from "@/lib/api/admin";
import { useEffect } from "react";
import { LuImage, LuUpload } from "react-icons/lu";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  primaryButtonText: z.string().optional().or(z.literal("")),
  primaryButtonUrl: z.string().url().optional().or(z.literal("")),
  secondaryButtonText: z.string().optional().or(z.literal("")),
  secondaryButtonUrl: z.string().url().optional().or(z.literal("")),
  backgroundImage: z.string().url().optional().or(z.literal("")),
  backgroundVideo: z.string().url().optional().or(z.literal("")),
  overlayOpacity: z.coerce.number().min(0).max(1).optional(),
  textAlignment: z.enum(["left", "center", "right"]).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.coerce.number().int().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function HeroSectionForm({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData?: HeroSection;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(
    initialData?.backgroundImage || null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      primaryButtonText: "",
      primaryButtonUrl: "",
      secondaryButtonText: "",
      secondaryButtonUrl: "",
      backgroundImage: "",
      backgroundVideo: "",
      overlayOpacity: 0.4,
      textAlignment: "left",
      isActive: true,
      displayOrder: 0,
    },
  });

  const createMutation = useCreateHeroSection();
  const updateMutation = useUpdateHeroSection();
  const uploadMutation = useUploadHeroImage();

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        subtitle: initialData.subtitle ?? "",
        description: initialData.description ?? "",
        primaryButtonText: initialData.primaryButtonText ?? "",
        primaryButtonUrl: initialData.primaryButtonUrl ?? "",
        secondaryButtonText: initialData.secondaryButtonText ?? "",
        secondaryButtonUrl: initialData.secondaryButtonUrl ?? "",
        backgroundImage: initialData.backgroundImage ?? "",
        backgroundVideo: initialData.backgroundVideo ?? "",
        overlayOpacity: initialData.overlayOpacity ?? 0.4,
        textAlignment: initialData.textAlignment ?? "left",
        isActive: initialData.isActive,
        displayOrder: initialData.displayOrder ?? 0,
      });
      setBackgroundImagePreview(initialData.backgroundImage || null);
    }
  }, [initialData]);

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackgroundImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    let backgroundImageUrl = values.backgroundImage;

    // Upload background image if a new file is selected
    if (backgroundImageFile) {
      const uploadResult = await uploadMutation.mutateAsync(backgroundImageFile);
      backgroundImageUrl = uploadResult.data.url;
    }

    const payload = {
      ...values,
      primaryButtonUrl: values.primaryButtonUrl || undefined,
      secondaryButtonUrl: values.secondaryButtonUrl || undefined,
      backgroundImage: backgroundImageUrl || undefined,
      backgroundVideo: values.backgroundVideo || undefined,
    };
    if (initialData) {
      await updateMutation.mutateAsync({ id: initialData.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<FormValues, "title">
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Amazing product for your business" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "subtitle">
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="Short supporting subheading" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "description">
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Optional descriptive text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "primaryButtonText">
            control={form.control}
            name="primaryButtonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Button Text</FormLabel>
                <FormControl>
                  <Input placeholder="Get Started" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<FormValues, "primaryButtonUrl">
            control={form.control}
            name="primaryButtonUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Button URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/signup" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "secondaryButtonText">
            control={form.control}
            name="secondaryButtonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Button Text</FormLabel>
                <FormControl>
                  <Input placeholder="Learn More" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<FormValues, "secondaryButtonUrl">
            control={form.control}
            name="secondaryButtonUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Button URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/docs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "backgroundImage">
            control={form.control}
            name="backgroundImage"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Background Image</FormLabel>
                <div className="space-y-4">
                  {backgroundImagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-gray-50">
                      <Image
                        src={backgroundImagePreview}
                        alt="Background preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </FormControl>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a background image or enter a URL below
                  </p>
                  <FormControl>
                    <Input placeholder="Or enter image URL: https://..." {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<FormValues, "backgroundVideo">
            control={form.control}
            name="backgroundVideo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription>Optional background video</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "textAlignment">
            control={form.control}
            name="textAlignment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Alignment</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "overlayOpacity">
            control={form.control}
            name="overlayOpacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overlay Opacity (0 - 1)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" min={0} max={1} value={field.value ?? 0} onChange={(e) => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "displayOrder">
            control={form.control}
            name="displayOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input type="number" value={field.value ?? 0} onChange={(e) => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<FormValues, "isActive">
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending || uploadMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending || uploadMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : null}
            {initialData ? "Save Changes" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
