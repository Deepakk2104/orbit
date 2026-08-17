"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  createComment,
  deleteComment,
  listComments,
} from "../api/comments.api";

import { useAuthStore } from "@/store/auth.store";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formatTime = (iso: string) => {
  const date = new Date(iso);

  return (
    date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })
  );
};

export function CommentSection({
  orgId,
  projectId,
  taskId,
}: {
  orgId: string;
  projectId: string;
  taskId: string;
}) {
  const queryClient = useQueryClient();

  const currentUser = useAuthStore((state) => state.user);

  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["task-comments", orgId, projectId, taskId],
    queryFn: () => listComments(orgId, projectId, taskId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["task-comments", orgId, projectId, taskId],
    });
  };

  const createMutation = useMutation({
    mutationFn: () => createComment(orgId, projectId, taskId, { content }),
    onSuccess: () => {
      setContent("");
      toast.success("Comment added successfully.");
      invalidate();
    },
    onError: () => {
      toast.error("Unable to add comment.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) =>
      deleteComment(orgId, projectId, taskId, commentId),
    onSuccess: () => {
      toast.success("Comment deleted successfully.");
      invalidate();
    },
    onError: () => {
      toast.error("Unable to delete comment.");
    },
  });

  const handleSubmit = () => {
    if (content.trim()) {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-1.5 text-sm font-medium">
        <MessageSquare className="size-4" />
        Comments
      </h4>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          handleSubmit();
        }}
        className="space-y-2"
      >
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={createMutation.isPending}
          className="min-h-20"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={createMutation.isPending || !content.trim()}
          >
            {createMutation.isPending && (
              <Loader2 className="mr-1 size-3.5 animate-spin" />
            )}
            Comment
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="text-muted-foreground size-4 animate-spin" />
        </div>
      ) : comments && comments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No comments yet. Start the conversation.
        </p>
      ) : (
        <ul className="space-y-3">
          {comments?.map((comment) => {
            const initials = comment.user.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            const isOwnComment = comment.user.id === currentUser?.id;

            return (
              <li key={comment.id} className="flex gap-3">
                <Avatar className="size-7">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">{comment.user.name}</p>

                    <span className="text-muted-foreground shrink-0 text-xs">
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {comment.content}
                  </p>
                </div>

                {isOwnComment && (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive self-start"
                    aria-label="Delete comment"
                    onClick={() => deleteMutation.mutate(comment.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending &&
                    deleteMutation.variables === comment.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
