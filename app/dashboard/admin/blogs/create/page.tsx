"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Spinner from "@/components/ui/spinner";
import { useCreateBlog } from "@/hooks/use-admin";
import type { CreateBlogDto } from "@/lib/api/admin";
import {
  LuArrowLeft,
  LuSave,
  LuEye,
  LuFileText,
  LuImage,
  LuSettings,
  LuTag,
} from "react-icons/lu";

// Dynamically import RichTextEditor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
// Validation schema
const blogSchema = yup.object({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  slug: yup.string().optional(),
  excerpt: yup.string().optional(),
  content: yup.string().required("Content is required"),
  featuredImage: yup.string().url("Must be a valid URL").optional(),
  imageAlt: yup.string().optional(),
  metaTitle: yup.string().max(70, "Meta title should be max 70 characters").optional(),
  metaDescription: yup.string().max(160, "Meta description should be max 160 characters").optional(),
  focusKeyword: yup.string().optional(),
  status: yup.string().oneOf(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).optional(),
  isFeatured: yup.boolean().optional(),
  allowComments: yup.boolean().optional(),
  isIndexable: yup.boolean().optional(),
});

type BlogFormData = yup.InferType<typeof blogSchema>;

const CreateBlogPage = () => {
  const router = useRouter();
  const createBlogMutation = useCreateBlog();
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "settings">("content");

  const form = useForm<BlogFormData>({
    resolver: yupResolver(blogSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      imageAlt: "",
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      status: "DRAFT",
      isFeatured: false,
      allowComments: true,
      isIndexable: true,
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    form.setValue("title", title);
    if (!form.getValues("slug")) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug);
    }
  };

    // Jodit editor config
  const joditConfig = useMemo(
    () => ({ readonly: false, placeholder: "Write your blog content" }),
    []
  );


  const onSubmit = async (data: BlogFormData) => {
    console.log("Submitting blog data:", data);
    createBlogMutation.mutate(data as CreateBlogDto, {
      onSuccess: () => {
        console.log("Blog created successfully");
        router.push("/dashboard/admin/blogs");
      },
      onError: (error: any) => {
        console.error("Failed to create blog:", error);
      },
    });
  };

  const handleSaveAsDraft = () => {
    form.setValue("status", "DRAFT");
    form.handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    form.setValue("status", "PUBLISHED");
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {createBlogMutation.isError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            Error: {(createBlogMutation.error as any)?.message || "Failed to create blog"}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/admin/blogs")}
          >
            <LuArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Blog Post</h1>
            <p className="text-sm text-muted-foreground">
              Write and publish your blog content
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={createBlogMutation.isPending}
          >
            <LuSave className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={createBlogMutation.isPending}
          >
            {createBlogMutation.isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <LuEye className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "content"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuFileText className="h-4 w-4" />
          Content
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "seo"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuTag className="h-4 w-4" />
          SEO
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "settings"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LuSettings className="h-4 w-4" />
          Settings
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Content</CardTitle>
                  <CardDescription>Write your blog post content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter blog title"
                      {...form.register("title")}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                    {form.formState.errors.title && (
                      <p className="mt-1 text-xs text-destructive">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="blog-post-slug"
                      {...form.register("slug")}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Auto-generated from title. You can customize it.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief description of your blog post"
                      rows={3}
                      {...form.register("excerpt")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content *</Label>
                    <Controller
                      name="content"
                      control={form.control}
                      render={({ field }) => (
                        <JoditEditor
                          value={field.value || ''}
                          config={joditConfig}
                          onBlur={field.onBlur}
                          onChange={(newContent: string) => field.onChange(newContent)}
                        />
                      )}
                    />
                    {form.formState.errors.content && (
                      <p className="mt-1 text-xs text-destructive">
                        {form.formState.errors.content.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LuImage className="h-5 w-5" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Image URL</Label>
                    <Input
                      id="featuredImage"
                      placeholder="https://example.com/image.jpg"
                      {...form.register("featuredImage")}
                    />
                    {form.formState.errors.featuredImage && (
                      <p className="mt-1 text-xs text-destructive">
                        {form.formState.errors.featuredImage.message}
                      </p>
                    )}
                  </div>

                  {form.watch("featuredImage") && (
                    <div className="relative aspect-video overflow-hidden rounded-md border">
                      <img
                        src={form.watch("featuredImage")}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="imageAlt">Alt Text</Label>
                    <Input
                      id="imageAlt"
                      placeholder="Describe the image"
                      {...form.register("imageAlt")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your blog post for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  placeholder="SEO title (max 70 characters)"
                  maxLength={70}
                  {...form.register("metaTitle")}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {form.watch("metaTitle")?.length || 0}/70 characters
                </p>
                {form.formState.errors.metaTitle && (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.metaTitle.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="SEO description (max 160 characters)"
                  maxLength={160}
                  rows={3}
                  {...form.register("metaDescription")}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {form.watch("metaDescription")?.length || 0}/160 characters
                </p>
                {form.formState.errors.metaDescription && (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.metaDescription.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusKeyword">Focus Keyword</Label>
                <Input
                  id="focusKeyword"
                  placeholder="Primary keyword for this post"
                  {...form.register("focusKeyword")}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure additional blog post options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Post</Label>
                  <p className="text-sm text-muted-foreground">
                    Mark this post as featured
                  </p>
                </div>
                <Controller
                  name="isFeatured"
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
                  <Label>Allow Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable comments on this post
                  </p>
                </div>
                <Controller
                  name="allowComments"
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
                  <Label>Search Engine Indexing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow search engines to index this post
                  </p>
                </div>
                <Controller
                  name="isIndexable"
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
        )}
      </form>
    </div>
  );
};

export default CreateBlogPage;
