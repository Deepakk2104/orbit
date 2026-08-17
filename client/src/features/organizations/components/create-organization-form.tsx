"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createOrganization } from "../api/organizations.api";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "../schemas/create-organization.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateOrganizationForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateOrganizationFormData) => {
    try {
      await createOrganization(data);

      toast.success("Organization created successfully.");
      reset();

      onCreated?.();
    } catch (error) {
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

      toast.error(message ?? "Unable to create organization.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization name</Label>

        <Input
          id="name"
          placeholder="Acme Corp"
          {...register("name")}
          disabled={isSubmitting}
        />

        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}

        {isSubmitting ? "Creating..." : "Create organization"}
      </Button>
    </form>
  );
}
