"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LuArrowLeft, LuMessageSquarePlus } from "react-icons/lu";
import { MessageArea } from "./_components/message-area";
import { MessageSidebar } from "./_components/message-sidebar";
import { NewConversationDialog } from "./_components/new-conversation-dialog";

export default function MessagesPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSelectRoom = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setMobileShowChat(true);
  }, []);

  const handleBackToSidebar = useCallback(() => {
    setMobileShowChat(false);
  }, []);

  const handleNewConversation = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setShowNewConversation(false);
    setMobileShowChat(true);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          {mobileShowChat && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={handleBackToSidebar}
            >
              <LuArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-foreground lg:text-xl">
            Messages
          </h1>
        </div>
        <Button
          variant="default"
          size="sm"
          className="gap-2"
          onClick={() => setShowNewConversation(true)}
        >
          <LuMessageSquarePlus className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile when chat is open */}
        <div
          className={cn(
            "w-full border-r border-border lg:w-80 xl:w-96",
            mobileShowChat ? "hidden lg:block" : "block",
          )}
        >
          <MessageSidebar
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
            currentUserId={user.id}
          />
        </div>

        {/* Chat Area - Hidden on mobile when sidebar is shown */}
        <div
          className={cn("flex-1", mobileShowChat ? "block" : "hidden lg:block")}
        >
          <MessageArea
            roomId={selectedRoomId}
            currentUserId={user.id}
            onBack={handleBackToSidebar}
          />
        </div>
      </div>

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        onConversationCreated={handleNewConversation}
      />
    </div>
  );
}
