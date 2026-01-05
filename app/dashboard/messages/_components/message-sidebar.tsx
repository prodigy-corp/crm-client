"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarkAsRead, useMessageSidebar } from "@/hooks/use-messages";
import { MessageRoom } from "@/lib/api/messages";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { LuMessageCircle, LuSearch, LuUsers } from "react-icons/lu";

interface MessageSidebarProps {
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  currentUserId: string;
}

export function MessageSidebar({
  selectedRoomId,
  onSelectRoom,
  currentUserId,
}: MessageSidebarProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, error } = useMessageSidebar(debouncedSearch);
  const { mutate: markAsRead } = useMarkAsRead();

  const rooms = useMemo(() => {
    // API returns { data: rooms[], success: true, message: '' }
    if (!data?.data) return [];
    return Array.isArray(data.data) ? data.data : [];
  }, [data]);

  const handleSelectRoom = useCallback(
    (room: MessageRoom) => {
      onSelectRoom(room.id);
      // Mark as read if there are unread messages
      if (room.unreadCount && room.unreadCount > 0) {
        markAsRead(room.id);
      }
    },
    [onSelectRoom, markAsRead],
  );

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMessageTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "";
    }
  };

  const getLastMessagePreview = (room: MessageRoom) => {
    const lastMessage = room.lastMessage;
    if (!lastMessage) return "No messages yet";

    if (lastMessage.type === "IMAGE") return "📷 Image";
    if (lastMessage.type === "VIDEO") return "🎬 Video";
    if (lastMessage.type === "AUDIO") return "🎵 Audio";
    if (lastMessage.type === "FILE") return "📎 File";

    const message = lastMessage.message || "";
    return message.length > 40 ? message.substring(0, 40) + "..." : message;
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        {/* Search */}
        <div className="border-b border-border p-3">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        {/* Room list skeleton */}
        <div className="flex-1 p-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-border p-3">
        <div className="relative">
          <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <LuMessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No conversations
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search ? "No results found" : "Start a new conversation"}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {rooms.map((room) => {
              const isGroup = room.isGroup;
              const displayName = isGroup
                ? room.name
                : room.otherUser?.name ||
                  (room.senderId === currentUserId
                    ? room.receiver?.name
                    : room.sender?.name) ||
                  "Unknown User";
              const displayAvatar = isGroup
                ? room.avatar
                : room.otherUser?.avatar ||
                  (room.senderId === currentUserId
                    ? room.receiver?.avatar
                    : room.sender?.avatar);
              const isSelected = selectedRoomId === room.id;
              const hasUnread = room.unreadCount && room.unreadCount > 0;

              return (
                <button
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50",
                  )}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-12 w-12 rounded-full">
                      <AvatarImage
                        src={displayAvatar}
                        alt={displayName || "Avatar"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {isGroup ? (
                          <LuUsers className="h-6 w-6" />
                        ) : (
                          getInitials(displayName)
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "truncate font-medium",
                          hasUnread ? "text-foreground" : "text-foreground",
                        )}
                      >
                        {displayName}
                      </span>
                      {room.lastMessage && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatMessageTime(room.lastMessage.sentAt)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-sm",
                          hasUnread
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {getLastMessagePreview(room)}
                      </span>
                      {hasUnread && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                          {room.unreadCount! > 99 ? "99+" : room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
