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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddMembers,
  useAvailableUsers,
  useRemoveMember,
  useUpdateGroup,
} from "@/hooks/use-messages";
import { MessageRoom, User } from "@/lib/api/messages";
import { useCallback, useMemo, useState } from "react";
import {
  LuPlus,
  LuSearch,
  LuTrash2,
  LuUserMinus,
  LuUsers,
} from "react-icons/lu";
import { toast } from "sonner";

interface GroupManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: MessageRoom;
  currentUserId: string;
}

export function GroupManagementDialog({
  open,
  onOpenChange,
  room,
  currentUserId,
}: GroupManagementDialogProps) {
  const [activeTab, setActiveTab] = useState("members");
  const [groupName, setGroupName] = useState(room.name || "");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isAdmin = useMemo(() => {
    const member = room.members?.find((m) => m.userId === currentUserId);
    return member?.isAdmin || room.creatorId === currentUserId;
  }, [room, currentUserId]);

  const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup(
    room.id,
  );
  const { mutate: addMembers, isPending: isAdding } = useAddMembers(room.id);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember(
    room.id,
  );

  // Debounced search for adding members
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const { data: availableUsers, isLoading: isLoadingUsers } = useAvailableUsers(
    debouncedSearch,
    activeTab === "add-members",
  );

  const users = useMemo(() => {
    if (!availableUsers?.data?.data) return [];
    const existingIds = room.members?.map((m) => m.userId) || [];
    const availableData = Array.isArray(availableUsers.data.data)
      ? availableUsers.data.data
      : [];
    return availableData.filter((u: User) => !existingIds.includes(u.id));
  }, [availableUsers, room]);

  const handleUpdateName = useCallback(() => {
    if (!groupName.trim() || groupName === room.name) return;
    updateGroup({ name: groupName.trim() });
  }, [groupName, room.name, updateGroup]);

  const handleAddMember = useCallback(
    (user: User) => {
      addMembers({ memberIds: [user.id] });
    },
    [addMembers],
  );

  const handleRemoveMember = useCallback(
    (userId: string) => {
      removeMember(userId);
    },
    [removeMember],
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LuUsers className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle>{room.name}</DialogTitle>
              <DialogDescription>
                {room.members?.length} members
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border px-6">
            <TabsList className="h-12 w-full gap-6 bg-transparent p-0">
              <TabsTrigger
                value="members"
                className="h-full rounded-none px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Members
              </TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger
                    value="add-members"
                    className="h-full rounded-none px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Add Members
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="h-full rounded-none px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Settings
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          <ScrollArea className="h-[350px]">
            <TabsContent value="members" className="m-0 p-4">
              <div className="space-y-4">
                {room.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.user.avatar}
                          alt={member.user.name}
                        />
                        <AvatarFallback>
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.isAdmin ? "Admin" : "Member"}
                        </p>
                      </div>
                    </div>
                    {isAdmin && member.userId !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveMember(member.userId)}
                        disabled={isRemoving}
                      >
                        <LuUserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="add-members" className="m-0 p-4">
              <div className="relative mb-4">
                <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users to add..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="space-y-4">
                {users.map((user: User) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1"
                      onClick={() => handleAddMember(user)}
                      disabled={isAdding}
                    >
                      <LuPlus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                ))}
                {!isLoadingUsers && users.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {search ? "No users found" : "Search for users to add"}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="m-0 space-y-6 p-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Button onClick={handleUpdateName} disabled={isUpdating}>
                    Save
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-medium text-destructive">
                  Danger Zone
                </p>
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => toast.error("Not implemented yet")}
                >
                  <LuTrash2 className="h-4 w-4" />
                  Leave Group
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="border-t border-border p-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
