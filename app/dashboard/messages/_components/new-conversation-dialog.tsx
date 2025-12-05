"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAvailableUsers, useInitiateMessage } from "@/hooks/use-messages";
import { User } from "@/lib/api/messages";
import { useCallback, useMemo, useState } from "react";
import { LuArrowLeft, LuCheck, LuSearch, LuSend, LuUser } from "react-icons/lu";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (roomId: string) => void;
}

type Step = "select-user" | "compose-message";

export function NewConversationDialog({
  open,
  onOpenChange,
  onConversationCreated,
}: NewConversationDialogProps) {
  const [step, setStep] = useState<Step>("select-user");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading } = useAvailableUsers(debouncedSearch, open);
  const { mutate: initiateMessage, isPending } = useInitiateMessage();

  const users = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser(user);
    setStep("compose-message");
  }, []);

  const handleBack = useCallback(() => {
    setStep("select-user");
    setMessage("");
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!selectedUser || !message.trim()) return;

    initiateMessage(
      { receiverId: selectedUser.id, message: message.trim() },
      {
        onSuccess: (response) => {
          const roomId = response.data?.roomId;
          if (roomId) {
            onConversationCreated(roomId);
            // Reset state
            setStep("select-user");
            setSelectedUser(null);
            setMessage("");
            setSearch("");
          }
        },
      },
    );
  }, [selectedUser, message, initiateMessage, onConversationCreated]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setStep("select-user");
      setSelectedUser(null);
      setMessage("");
      setSearch("");
    }, 200);
  }, [onOpenChange]);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-0 p-0">
        {/* Header */}
        <DialogHeader className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            {step === "compose-message" && (
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2"
                onClick={handleBack}
              >
                <LuArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <DialogTitle>
                {step === "select-user" ? "New Message" : "Compose Message"}
              </DialogTitle>
              <DialogDescription>
                {step === "select-user"
                  ? "Select a user to start a conversation"
                  : `Send a message to ${selectedUser?.name}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === "select-user" ? (
          <>
            {/* Search */}
            <div className="border-b border-border p-4">
              <div className="relative">
                <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* User List */}
            <ScrollArea className="max-h-80">
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 rounded-full bg-muted p-3">
                    <LuUser className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {search ? "No users found" : "No users available"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {search
                      ? "Try a different search term"
                      : "There are no other users to message"}
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">
                          {user.name}
                        </p>
                        {user.email && (
                          <p className="truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <>
            {/* Selected User Info */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  src={selectedUser?.avatar}
                  alt={selectedUser?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(selectedUser?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {selectedUser?.name}
                </p>
                {selectedUser?.email && (
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                )}
              </div>
              <div className="ml-auto rounded-full bg-green-100 p-1.5 dark:bg-green-900/30">
                <LuCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
                autoFocus
              />
            </div>

            {/* Footer */}
            <DialogFooter className="border-t border-border p-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isPending}
                className="gap-2"
              >
                <LuSend className="h-4 w-4" />
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
