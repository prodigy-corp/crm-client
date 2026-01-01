"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { LuMessageSquare, LuSend } from "react-icons/lu";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  isAdding: boolean;
  title?: string;
}

export const CommentsSection = ({
  comments,
  onAddComment,
  isAdding,
  title = "Comments",
}: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <Card className="flex h-full max-h-[600px] flex-col">
      <CardHeader className="py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <LuMessageSquare className="h-5 w-5 text-primary" />
          {title} ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden pt-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">
                  No comments yet. Start the conversation!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex animate-in gap-3 fade-in slide-in-from-bottom-2"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>
                      {comment.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {comment.user.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-muted p-3 text-sm leading-relaxed">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="relative mt-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none bg-background pr-12 focus-visible:ring-primary/20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isAdding || !newComment.trim()}
            className="absolute right-3 bottom-3 rounded-full shadow-lg"
          >
            <LuSend className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
