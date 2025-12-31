"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAnnouncements,
  useDeleteAnnouncement,
} from "@/hooks/use-announcements";
import { Announcement, AnnouncementType } from "@/lib/api/announcements";
import { format } from "date-fns";
import { CheckCircle, Pencil, Plus, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { AnnouncementModal } from "./announcement-modal";

export function AnnouncementList() {
  const { data: announcements, isLoading } = useAnnouncements();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTypeBadge = (type: AnnouncementType) => {
    switch (type) {
      case "INFO":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-[10px] text-blue-700 uppercase hover:bg-blue-100"
          >
            Info
          </Badge>
        );
      case "SUCCESS":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-[10px] text-green-700 uppercase hover:bg-green-100"
          >
            Success
          </Badge>
        );
      case "WARNING":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-[10px] text-yellow-700 uppercase hover:bg-yellow-100"
          >
            Warning
          </Badge>
        );
      case "DANGER":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-[10px] text-red-700 uppercase hover:bg-red-100"
          >
            Danger
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] uppercase">
            {type}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading announcements...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Broadcasting History</h2>
        <Button
          onClick={() => {
            setSelectedAnnouncement(null);
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> New Announcement
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements?.map((ann) => (
              <TableRow key={ann.id}>
                <TableCell className="max-w-[200px] truncate font-medium">
                  {ann.title}
                </TableCell>
                <TableCell>{getTypeBadge(ann.type)}</TableCell>
                <TableCell>
                  {ann.isActive ? (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" /> Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-red-500">
                      <XCircle className="h-3 w-3" /> Inactive
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {format(new Date(ann.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-xs">
                  {ann.expiresAt
                    ? format(new Date(ann.expiresAt), "MMM d, yyyy")
                    : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAnnouncement(ann);
                        setIsModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Delete this announcement?"))
                          deleteAnnouncement.mutate(ann.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {announcements?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No announcements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AnnouncementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        announcement={selectedAnnouncement}
      />
    </div>
  );
}
