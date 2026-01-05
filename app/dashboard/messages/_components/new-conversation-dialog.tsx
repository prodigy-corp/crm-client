"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAvailableUsers,
  useCreateGroup,
  useInitiateMessage,
} from "@/hooks/use-messages";
import { User } from "@/lib/api/messages";
import { X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  LuArrowLeft,
  LuCheck,
  LuSearch,
  LuSend,
  LuUser,
  LuUsers,
} from "react-icons/lu";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (roomId: string) => void;
}

type Step = "select-users" | "group-info" | "compose-message";

export function NewConversationDialog({
  open,
  onOpenChange,
  onConversationCreated,
}: NewConversationDialogProps) {
  const [step, setStep] = useState<Step>("select-users");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");

  const isGroup = selectedUsers.length > 1;

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading } = useAvailableUsers(debouncedSearch, open);
  const { mutate: initiateMessage, isPending: isInitiating } =
    useInitiateMessage();
  const { mutate: createGroup, isPending: isCreatingGroup } = useCreateGroup();

  const isPending = isInitiating || isCreatingGroup;

  const users = useMemo(() => {
    if (!data?.data) return [];
    return Array.isArray(data.data) ? data.data : [];
  }, [data]);

  const toggleUser = useCallback((user: User) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  }, []);

  const handleNext = useCallback(() => {
    if (selectedUsers.length === 0) return;
    if (selectedUsers.length === 1) {
      setStep("compose-message");
    } else {
      setStep("group-info");
    }
  }, [selectedUsers]);

  const handleBack = useCallback(() => {
    if (step === "compose-message" || step === "group-info") {
      setStep("select-users");
    }
  }, [step]);

  const handleSendMessage = useCallback(() => {
    if (selectedUsers.length === 0) return;

    if (selectedUsers.length === 1) {
      if (!message.trim()) return;
      initiateMessage(
        { receiverId: selectedUsers[0].id, message: message.trim() },
        {
          onSuccess: (response: any) => {
            const roomId = response.data?.roomId;
            if (roomId) {
              onConversationCreated(roomId);
              handleClose();
            }
          },
        },
      );
    } else {
      if (!groupName.trim()) return;
      createGroup(
        { name: groupName.trim(), memberIds: selectedUsers.map((u) => u.id) },
        {
          onSuccess: (response) => {
            const roomId = response.data?.id;
            if (roomId) {
              onConversationCreated(roomId);
              handleClose();
            }
          },
        },
      );
    }
  }, [
    selectedUsers,
    message,
    groupName,
    initiateMessage,
    createGroup,
    onConversationCreated,
  ]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setStep("select-users");
      setSelectedUsers([]);
      setGroupName("");
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
            {step !== "select-users" && (
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
                {step === "select-users"
                  ? "New Message"
                  : step === "group-info"
                    ? "Group Details"
                    : "Compose Message"}
              </DialogTitle>
              <DialogDescription>
                {step === "select-users"
                  ? "Select users to start a conversation"
                  : step === "group-info"
                    ? "Set a name for your new group"
                    : `Send a message to ${selectedUsers[0]?.name}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === "select-users" ? (
          <>
            {/* Search and Selected Count */}
            <div className="space-y-4 border-b border-border p-4">
              <div className="relative">
                <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <Badge
                      key={user.id}
                      variant="secondary"
                      className="gap-1 px-2 py-1"
                    >
                      {user.name}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => toggleUser(user)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
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
                </div>
              ) : (
                <div className="p-2">
                  {users.map((user) => {
                    const isSelected = selectedUsers.some(
                      (u) => u.id === user.id,
                    );
                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                      >
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={isSelected}
                          onCheckedChange={() => toggleUser(user)}
                          className="ml-2"
                        />
                        <Label
                          htmlFor={`user-${user.id}`}
                          className="flex flex-1 cursor-pointer items-center gap-3 py-1"
                        >
                          <Avatar className="h-10 w-10 rounded-full">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {user.name}
                            </p>
                            {user.email && (
                              <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <DialogFooter className="border-t border-border p-4">
              <Button
                variant="default"
                onClick={handleNext}
                disabled={selectedUsers.length === 0}
                className="w-full"
              >
                Next
              </Button>
            </DialogFooter>
          </>
        ) : step === "group-info" ? (
          <>
            <div className="space-y-4 p-6">
              <div className="mb-4 flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <LuUsers className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">New Group</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedUsers.length} members
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter className="border-t border-border p-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!groupName.trim() || isPending}
                className="gap-2"
              >
                {isPending ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            {/* Selected User Info */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  src={selectedUsers[0]?.avatar}
                  alt={selectedUsers[0]?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(selectedUsers[0]?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {selectedUsers[0]?.name}
                </p>
                {selectedUsers[0]?.email && (
                  <p className="text-sm text-muted-foreground">
                    {selectedUsers[0].email}
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
