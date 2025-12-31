"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "@/hooks/use-announcements";
import { Announcement } from "@/lib/api/announcements";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
}

export function AnnouncementModal({
  open,
  onOpenChange,
  announcement,
}: AnnouncementModalProps) {
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const isActive = watch("isActive", true);

  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        isActive: announcement.isActive,
        expiresAt: announcement.expiresAt
          ? new Date(announcement.expiresAt).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        title: "",
        content: "",
        type: "INFO",
        isActive: true,
        expiresAt: "",
      });
    }
  }, [announcement, reset, open]);

  const onSubmit = (data: any) => {
    if (announcement) {
      updateAnnouncement.mutate(
        { id: announcement.id, data },
        {
          onSuccess: () => onOpenChange(false),
        },
      );
    } else {
      createAnnouncement.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {announcement ? "Edit Announcement" : "Create Announcement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: true })}
              placeholder="e.g. System Maintenance"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(val) => setValue("type", val)}
                defaultValue={announcement?.type || "INFO"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">Information</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="DANGER">Danger</SelectItem>
                  <SelectItem value="PRIMARY">Primary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At (Optional)</Label>
              <Input id="expiresAt" type="date" {...register("expiresAt")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              {...register("content", { required: true })}
              placeholder="Write your broadcast message here..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-[12px] font-normal text-muted-foreground">
                Inactive announcements will not be shown to users.
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createAnnouncement.isPending || updateAnnouncement.isPending
              }
            >
              {announcement ? "Update Announcement" : "Broadcast Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
