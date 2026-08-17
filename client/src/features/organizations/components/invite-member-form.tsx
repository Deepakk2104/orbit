"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { inviteMember } from "../api/organizations.api";
import {
  inviteMemberSchema,
  type InviteMemberFormData,
} from "../schemas/invite-member.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteMemberForm({ orgId }: { orgId: string }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InviteMemberFormData) => inviteMember(orgId, data),
    onSuccess: (data) => {
      toast.success("Invitation sent successfully.");

      if (data.token) {
        toast.info(`Dev invitation token: ${data.token}`);
      }

      reset();

      queryClient.invalidateQueries({
        queryKey: ["organization", orgId],
      });
    },
    onError: (error) => {
      const message =
        typeof error === "object" && error !== null && "response" in error
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

      toast.error(message ?? "Unable to send invitation.");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Invite by email</Label>

        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            placeholder="teammate@example.com"
            {...register("email")}
            disabled={mutation.isPending}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Send className="mr-2 size-4" />
            )}

            {mutation.isPending ? "Sending..." : "Invite"}
          </Button>
        </div>

        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>
    </form>
  );
}
