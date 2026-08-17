"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateProfile } from "../api/profile.api";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "../schemas/update-profile.schema";

import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      avatar: user?.avatar ?? "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      const updated = await updateProfile(data);

      setUser(updated);

      toast.success("Profile updated successfully.");
    } catch (error) {
      if (axiosErrorMessage(error)) {
        toast.error(axiosErrorMessage(error));
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>

        <Input
          id="name"
          placeholder="John Doe"
          autoComplete="name"
          {...register("name")}
          disabled={isSubmitting}
        />

        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar URL (optional)</Label>

        <Input
          id="avatar"
          type="url"
          placeholder="https://example.com/avatar.png"
          {...register("avatar")}
          disabled={isSubmitting}
        />

        {errors.avatar && (
          <p className="text-destructive text-sm">{errors.avatar.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}

function axiosErrorMessage(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    return response?.data?.message ?? null;
  }

  return null;
}
