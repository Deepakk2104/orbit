"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Crown, Loader2, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { listMembers, removeMember } from "../api/organizations.api";

import { useAuthStore } from "@/store/auth.store";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function MembersList({ orgId }: { orgId: string }) {
  const currentUser = useAuthStore((state) => state.user);

  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ["organization", orgId, "members"],
    queryFn: () => listMembers(orgId),
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) =>
      removeMember(orgId, memberId),
    onSuccess: () => {
      toast.success("Member removed successfully.");

      queryClient.invalidateQueries({
        queryKey: ["organization", orgId],
      });
    },
    onError: (error) => {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      toast.error(message ?? "Unable to remove member.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No members yet. Invite someone to join.
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {members.map((member) => {
        const initials = member.user.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        const isCurrentUser = member.user.id === currentUser?.id;

        return (
          <li
            key={member.id}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium">
                  {member.user.name}

                  {isCurrentUser && (
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      (you)
                    </span>
                  )}
                </p>

                <p className="text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {member.role === "OWNER" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium uppercase text-muted-foreground">
                  <Crown className="size-3" />

                  Owner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium uppercase text-muted-foreground">
                  <User className="size-3" />

                  Member
                </span>
              )}

              {member.role !== "OWNER" && !isCurrentUser && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeMutation.mutate(member.id)}
                  disabled={removeMutation.isPending}
                >
                  {removeMutation.isPending &&
                  removeMutation.variables === member.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}