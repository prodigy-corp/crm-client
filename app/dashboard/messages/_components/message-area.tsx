"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteMessage,
  useMarkAsRead,
  useMessageRoom,
  useSendMessage,
} from "@/hooks/use-messages";
import { Message, MessageRoom } from "@/lib/api/messages";
import { User } from "@/lib/dataTypes";
import { cn } from "@/lib/utils";
import { format, isSameDay, isToday, isYesterday } from "date-fns";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LuCheck,
  LuCheckCheck,
  LuImage,
  LuMessageCircle,
  LuSend,
  LuTrash2,
} from "react-icons/lu";

interface MessageAreaProps {
  roomId: string | null;
  currentUserId: string;
  onBack?: () => void;
}

export function MessageArea({
  roomId,
  currentUserId,
  onBack,
}: MessageAreaProps) {
  const [message, setMessage] = useState("");
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useMessageRoom(roomId || "", !!roomId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage(
    roomId || "",
  );
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage(
    roomId || "",
  );
  const { mutate: markAsRead } = useMarkAsRead();

  // API client transforms: { data: roomData, success, message }
  // roomData contains { ...room, messages, otherUser }
  const roomData = useMemo(
    () =>
      data?.data as
        | (MessageRoom & { messages: Message[]; otherUser: User })
        | undefined,
    [data],
  );
  const messages = useMemo(() => {
    if (!roomData?.messages) return [];
    return [...roomData.messages].reverse();
  }, [roomData]);
  const otherUser = useMemo(() => roomData?.otherUser, [roomData]);

  useEffect(() => {
    if (roomId) {
      markAsRead(roomId);
    }
  }, [roomId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (roomId) {
      inputRef.current?.focus();
    }
  }, [roomId]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !roomId) return;
    sendMessage(
      { payload: { message: message.trim(), type: "TEXT" } },
      {
        onSuccess: () => {
          setMessage("");
          inputRef.current?.focus();
        },
      },
    );
  }, [message, roomId, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0 || !roomId) return;

      // Determine file type based on first file
      const file = files[0];
      let fileType: "IMAGE" | "VIDEO" | "AUDIO" | "FILE" = "FILE";
      if (file.type.startsWith("image/")) fileType = "IMAGE";
      else if (file.type.startsWith("video/")) fileType = "VIDEO";
      else if (file.type.startsWith("audio/")) fileType = "AUDIO";

      sendMessage({ payload: { type: fileType }, files: Array.from(files) });
      e.target.value = "";
    },
    [roomId, sendMessage],
  );

  const handleDeleteMessage = useCallback(() => {
    if (!deleteMessageId) return;
    deleteMessage(deleteMessageId, {
      onSuccess: () => setDeleteMessageId(null),
    });
  }, [deleteMessageId, deleteMessage]);

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
      return format(new Date(date), "h:mm a");
    } catch {
      return "";
    }
  };

  const formatDateSeparator = (date: string) => {
    try {
      const d = new Date(date);
      if (isToday(d)) return "Today";
      if (isYesterday(d)) return "Yesterday";
      return format(d, "MMMM d, yyyy");
    } catch {
      return "";
    }
  };

  const shouldShowDateSeparator = (index: number, currentMessage: Message) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return !isSameDay(
      new Date(prevMessage.sentAt),
      new Date(currentMessage.sentAt),
    );
  };

  if (!roomId) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-muted/30 p-8">
        <div className="mb-4 rounded-full bg-muted p-6">
          <LuMessageCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Your Messages</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          Select a conversation from the sidebar or start a new one
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex-1 space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2",
                i % 2 === 0 ? "justify-start" : "justify-end",
              )}
            >
              {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
              <Skeleton className="h-12 w-48 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <p className="text-destructive">Failed to load messages</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(otherUser?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">
              {otherUser?.name || "Unknown User"}
            </h3>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive">
              <LuTrash2 className="mr-2 h-4 w-4" />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-muted/20">
        <div className="space-y-1 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">
                No messages yet. Say hello! 👋
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.senderId === currentUserId;
              const showDateSeparator = shouldShowDateSeparator(index, msg);

              return (
                <div key={msg.id}>
                  {showDateSeparator && (
                    <div className="my-4 flex items-center justify-center">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {formatDateSeparator(msg.sentAt)}
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      "group mb-1 flex items-end gap-2",
                      isOwn ? "justify-end" : "justify-start",
                    )}
                  >
                    {!isOwn && (
                      <Avatar className="h-7 w-7 rounded-full">
                        <AvatarImage src={otherUser?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {getInitials(otherUser?.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "relative max-w-[75%] rounded-2xl px-4 py-2",
                        isOwn
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-card shadow-sm",
                      )}
                    >
                      {msg.type === "IMAGE" && msg.attachment && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_ASSET_URL}/${msg.attachment}`}
                          alt="Attachment"
                          className="max-h-60 max-w-full rounded-lg object-cover"
                        />
                      )}

                      {msg.message && (
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      )}

                      <div
                        className={cn(
                          "mt-1 flex items-center gap-1",
                          isOwn ? "justify-end" : "justify-start",
                        )}
                      >
                        <span
                          className={cn(
                            "text-[10px]",
                            isOwn
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatMessageTime(msg.sentAt)}
                        </span>
                        {isOwn && (
                          <span
                            className={cn(
                              "text-primary-foreground/70",
                              msg.isRead ? "text-primary-foreground" : "",
                            )}
                          >
                            {msg.isRead ? (
                              <LuCheckCheck className="h-3 w-3" />
                            ) : (
                              <LuCheck className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>

                      {isOwn && (
                        <button
                          onClick={() => setDeleteMessageId(msg.id)}
                          className="absolute top-1/2 -left-8 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <LuTrash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border bg-card p-3 lg:p-4">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <LuImage className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isSending}
          />
          <Button
            size="icon"
            className="shrink-0"
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
          >
            <LuSend className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteMessageId}
        onOpenChange={(open) => !open && setDeleteMessageId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMessage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
